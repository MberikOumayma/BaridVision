import torch
import torch.nn as nn
import timm
import cv2
import numpy as np
from PIL import Image
from torchvision import transforms
import threading
import queue
import time
import logging
import json
import os

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ConvNeXtV2Regressor(nn.Module):
    def __init__(self, dropout_p=0.3):
        super().__init__()
        base_model = timm.create_model('convnextv2_large', pretrained=False)
        in_features = base_model.head.fc.in_features
        base_model.head.fc = nn.Identity()
        self.backbone = base_model
        self.dropout = nn.Dropout(dropout_p)
        self.fc = nn.Linear(in_features, 3)

    def forward(self, x):
        x = self.backbone(x)
        x = self.dropout(x)
        x = self.fc(x)
        return x

class DimensionEstimationService:
    def __init__(self, model_path, batch_size=4, processing_interval=0.5):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        logger.info(f"Using device: {self.device}")
        
        # Charger le modèle
        self.model = ConvNeXtV2Regressor()
        try:
            self.model.load_state_dict(torch.load(model_path, map_location=self.device))
            self.model.to(self.device)
            self.model.eval()
            logger.info("Modèle de dimensions chargé avec succès")
            
            # Test du modèle avec une entrée factice
            self.test_model_with_dummy_input()
            
        except Exception as e:
            logger.error(f"Erreur lors du chargement du modèle: {e}")
            raise
        
        # Transformation des images - CORRIGÉ: même taille qu'à l'entraînement (224x224)
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),  # ← CHANGÉ: de (480, 480) à (224, 224)
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                               std=[0.229, 0.224, 0.225]),
        ])
        
        # Facteurs de correction - à ajuster expérimentalement
        self.correction_factors = self.load_calibration()
        
        # File d'attente pour le traitement
        self.task_queue = queue.Queue()
        self.results = {}
        self.batch_size = batch_size
        self.processing_interval = processing_interval
        
        # Démarrer le thread de traitement
        self.processing_thread = threading.Thread(target=self._process_queue, daemon=True)
        self.processing_thread.start()
        logger.info("Service d'estimation des dimensions démarré")
    
    def test_model_with_dummy_input(self):
        """Teste le modèle avec une entrée factice pour vérifier son fonctionnement"""
        dummy_input = torch.randn(1, 3, 224, 224).to(self.device)
        with torch.no_grad():
            output = self.model(dummy_input)
        logger.info(f"Test modèle - Sortie factice: {output.cpu().numpy()}")
        return output
    
    def load_calibration(self):
        """Charge les facteurs de calibration depuis un fichier"""
        calibration_file = "calibration_factors.json"
        default_factors = {
            'length': 0.45,  # Facteurs initiaux basés sur votre observation
            'width': 0.45,
            'height': 1.0
        }
        
        try:
            if os.path.exists(calibration_file):
                with open(calibration_file, 'r') as f:
                    return json.load(f)
        except Exception as e:
            logger.warning(f"Erreur lors du chargement de la calibration: {e}")
        
        return default_factors
    
    def save_calibration(self):
        """Sauvegarde les facteurs de calibration dans un fichier"""
        calibration_file = "calibration_factors.json"
        try:
            with open(calibration_file, 'w') as f:
                json.dump(self.correction_factors, f, indent=4)
            logger.info(f"Calibration sauvegardée: {self.correction_factors}")
        except Exception as e:
            logger.error(f"Erreur lors de la sauvegarde de la calibration: {e}")
    
    def calibrate_with_reference(self, reference_image, known_dimensions):
        """
        Calibre le modèle avec une image de référence de dimensions connues
        known_dimensions: {'length_cm': ..., 'width_cm': ..., 'height_cm': ...}
        """
        try:
            # Convertir l'image
            image_rgb = cv2.cvtColor(reference_image, cv2.COLOR_BGR2RGB)
            pil_image = Image.fromarray(image_rgb)
            input_tensor = self.transform(pil_image).unsqueeze(0).to(self.device)
            
            # Prédiction
            with torch.no_grad():
                predicted = self.model(input_tensor).cpu().numpy()[0]
            
            # Calculer les facteurs de correction
            self.correction_factors = {
                'length': known_dimensions['length_cm'] / predicted[0],
                'width': known_dimensions['width_cm'] / predicted[1],
                'height': known_dimensions['height_cm'] / predicted[2]
            }
            
            self.save_calibration()
            logger.info(f"Calibration effectuée: {self.correction_factors}")
            
        except Exception as e:
            logger.error(f"Erreur lors de la calibration: {e}")
    
    def add_task(self, track_id, image):
        """Ajoute une image à traiter pour un track_id donné"""
        if image.size == 0:
            logger.warning(f"Image vide pour track_id {track_id}")
            return
        
        # Convertir BGR to RGB
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        self.task_queue.put((track_id, image_rgb))
        logger.info(f"Tâche ajoutée pour track_id {track_id}")
    
    def _process_queue(self):
        """Thread de traitement qui traite les images par lots"""
        while True:
            try:
                # Attendre un peu avant de traiter le lot suivant
                time.sleep(self.processing_interval)
                
                # Récupérer un lot d'images à traiter
                batch = []
                track_ids = []
                
                while not self.task_queue.empty() and len(batch) < self.batch_size:
                    track_id, image = self.task_queue.get()
                    batch.append(image)
                    track_ids.append(track_id)
                
                if not batch:
                    continue
                
                # Traiter le lot
                self._process_batch(track_ids, batch)
                
            except Exception as e:
                logger.error(f"Erreur dans le thread de traitement: {e}")
    
    def _process_batch(self, track_ids, images):
        """Traite un lot d'images"""
        try:
            # Préparer les tenseurs d'entrée
            input_tensors = []
            for image in images:
                pil_image = Image.fromarray(image)
                input_tensor = self.transform(pil_image).unsqueeze(0).to(self.device)
                input_tensors.append(input_tensor)
            
            # Concaténer les tenseurs
            batch_tensor = torch.cat(input_tensors, dim=0)
            
            # Prédiction
            with torch.no_grad():
                outputs = self.model(batch_tensor)
            
            # Stocker les résultats avec correction
            for i, track_id in enumerate(track_ids):
                dimensions = outputs[i].cpu().numpy()
                
                # Appliquer les facteurs de correction
                corrected_length = float(dimensions[0]) * self.correction_factors['length']
                corrected_width = float(dimensions[1]) * self.correction_factors['width']
                corrected_height = float(dimensions[2]) * self.correction_factors['height']
                
                # Log des valeurs brutes et corrigées pour debug
                logger.info(f"Track {track_id} - Brut: {dimensions}, Corrigé: L={corrected_length:.2f}, W={corrected_width:.2f}, H={corrected_height:.2f}")
                
                self.results[track_id] = {
                    'length_cm': corrected_length,
                    'width_cm': corrected_width,
                    'height_cm': corrected_height,
                    'raw_length': float(dimensions[0]),  # Pour debug
                    'raw_width': float(dimensions[1]),   # Pour debug
                    'raw_height': float(dimensions[2])   # Pour debug
                }
                
        except Exception as e:
            logger.error(f"Erreur lors du traitement du lot: {e}")
    
    def get_result(self, track_id):
        """Récupère le résultat pour un track_id donné"""
        return self.results.get(track_id)
    
    def has_result(self, track_id):
        """Vérifie si un résultat est disponible pour un track_id"""
        return track_id in self.results
    
    def cleanup_old_results(self, max_age_seconds=300):
        """Nettoie les résultats anciens"""
        current_time = time.time()
        keys_to_remove = []
        
        for track_id, result in self.results.items():
            if 'timestamp' in result and current_time - result['timestamp'] > max_age_seconds:
                keys_to_remove.append(track_id)
        
        for track_id in keys_to_remove:
            del self.results[track_id]
    
    def update_correction_factors(self, new_factors):
        """Met à jour les facteurs de correction"""
        self.correction_factors.update(new_factors)
        self.save_calibration()
        logger.info(f"Facteurs de correction mis à jour: {self.correction_factors}")