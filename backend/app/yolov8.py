import cv2
import numpy as np
from ultralytics import YOLO
from pathlib import Path
import os
import logging
import time

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import du service d'estimation des dimensions
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dimension_service import DimensionEstimationService

class TrackedObject:
    def __init__(self, track_id, xywh):
        self.track_id = track_id
        self._xywh = xywh

    def to_tlwh(self):
        return self._xywh

class YOLOv8Detector:
    def __init__(self, model_path="models/best.pt", tracker_config=None):
        model_path = str(Path(model_path).resolve())
        self.model = YOLO(model_path)
        self.model.fuse()
        self.tracker_config = tracker_config
        
        # Initialiser le service d'estimation des dimensions
        dimension_model_path = os.path.join(os.path.dirname(__file__), "../models/model_dimensions.pt")
        self.dimension_service = DimensionEstimationService(dimension_model_path)

        # Pour détecter stabilité
        self.last_positions = {}
        self.stable_counts = {}
        self.sent_ids = set()
        self.pending_estimation = set()
        self.quality_scores = {}
        self.debug_info = {}  # Stocke les info de debug pour chaque track_id
        self.debug_frame_count = 0
        self.debug_output_dir = "/tmp/debug_frames"  # Dossier pour sauvegarder les images de debug

        # Créer le dossier de debug
        os.makedirs(self.debug_output_dir, exist_ok=True)

        self.MIN_STABLE_FRAMES = 10
        self.BBOX_EXPANSION_FACTOR = 1.1
        self.MIN_QUALITY_SCORE = 0.5  # Seuil très bas pour testing

    def expand_bounding_box(self, bbox, frame_shape):
        """Agrandit légèrement la bounding box"""
        x1, y1, x2, y2 = bbox
        height, width = frame_shape[:2]
        
        w = x2 - x1
        h = y2 - y1
        
        expansion_w = int(w * (self.BBOX_EXPANSION_FACTOR - 1) / 2)
        expansion_h = int(h * (self.BBOX_EXPANSION_FACTOR - 1) / 2)
        
        new_x1 = max(0, x1 - expansion_w)
        new_y1 = max(0, y1 - expansion_h)
        new_x2 = min(width, x2 + expansion_w)
        new_y2 = min(height, y2 + expansion_h)
        
        return [new_x1, new_y1, new_x2, new_y2]

    def calculate_view_quality(self, frame, bbox, track_id):
        """
        Version simplifiée et debugable du calcul de qualité
        """
        x1, y1, x2, y2 = bbox
        roi = frame[y1:y2, x1:x2]
        
        if roi.size == 0 or roi.shape[0] < 10 or roi.shape[1] < 10:
            return 0.0, {}
        
        debug_data = {}
        
        # 1. Ratio de remplissage de la ROI
        gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
        _, binary = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)
        fill_ratio = np.sum(binary > 0) / binary.size
        debug_data['fill_ratio'] = fill_ratio
        
        # 2. Détection de contours
        edges = cv2.Canny(gray, 50, 150)
        edge_ratio = np.sum(edges > 0) / edges.size if edges.size > 0 else 0
        debug_data['edge_ratio'] = edge_ratio
        
        # 3. Détection de lignes avec Hough
        lines = cv2.HoughLinesP(edges, 1, np.pi/180, threshold=50, minLineLength=30, maxLineGap=10)
        line_count = len(lines) if lines is not None else 0
        debug_data['line_count'] = line_count
        
        # 4. Score basé sur la présence de lignes horizontales/verticales
        line_score = min(line_count / 10.0, 1.0)  # Normalisé
        
        # 5. Score composite très simple
        quality_score = min((fill_ratio * 0.4 + edge_ratio * 0.3 + line_score * 0.3) * 1.5, 1.0)
        debug_data['quality_score'] = quality_score
        
        # DEBUG: Sauvegarder l'image de la ROI pour analyse
        if self.debug_frame_count % 30 == 0:  # Toutes les 30 frames
            debug_img_path = os.path.join(self.debug_output_dir, f"roi_{track_id}_{int(time.time())}.jpg")
            cv2.imwrite(debug_img_path, roi)
            debug_data['debug_image'] = debug_img_path
        
        return quality_score, debug_data

    def is_frontal_view(self, bbox, frame_shape):
        """
        Version simplifiée - toujours retourner True pour testing
        """
        return True

    def process_frame(self, frame):
        self.debug_frame_count += 1
        
        results = self.model.track(
            frame, 
            persist=True,
            conf=0.5,
            iou=0.4,
            tracker=self.tracker_config
        )

        processed_frame = frame.copy()
        tracked_objects = []
        dimensions_data = None

        for result in results:
            if result.boxes is None or result.boxes.id is None:
                continue

            boxes = result.boxes
            for i in range(len(boxes)):
                track_id = int(boxes.id[i].item())
                conf = boxes.conf[i].item()
                if conf < 0.5:
                    continue

                x1, y1, x2, y2 = map(int, boxes.xyxy[i])
                
                # Agrandir légèrement la bounding box
                expanded_bbox = self.expand_bounding_box([x1, y1, x2, y2], frame.shape)
                x1, y1, x2, y2 = expanded_bbox
                
                w, h = x2 - x1, y2 - y1
                bbox = [x1, y1, x2, y2]

                # Calculer la qualité de la vue avec debug
                quality_score, debug_data = self.calculate_view_quality(frame, bbox, track_id)
                self.debug_info[track_id] = debug_data
                
                # Vérifier si la vue est frontale (toujours True pour testing)
                is_frontal = self.is_frontal_view(bbox, frame.shape)
                
                self.quality_scores[track_id] = quality_score

                # Vérification stabilité (simplifiée)
                prev_bbox = self.last_positions.get(track_id)
                if prev_bbox and np.linalg.norm(np.array(prev_bbox) - np.array(bbox)) < 25:
                    self.stable_counts[track_id] = self.stable_counts.get(track_id, 0) + 1
                else:
                    self.stable_counts[track_id] = 1

                self.last_positions[track_id] = bbox

                # LOGGING DÉTAILLÉ POUR DEBUG
                if self.debug_frame_count % 10 == 0:
                    logger.info(f"Track {track_id} - Stable: {self.stable_counts[track_id]}/{self.MIN_STABLE_FRAMES}, "
                               f"Quality: {quality_score:.2f}/{self.MIN_QUALITY_SCORE}, "
                               f"Frontal: {is_frontal}")

                # CONDITIONS SIMPLIFIÉES POUR TESTING
                is_stable = self.stable_counts[track_id] >= self.MIN_STABLE_FRAMES
                is_high_quality = quality_score >= self.MIN_QUALITY_SCORE
                
                # FORCER LE VERT POUR TESTING - Supprimer cette ligne après debug
                force_green = True  # À METTRE À FALSE APRÈS DEBUG

                if (is_stable and is_high_quality) or force_green:
                    if track_id not in self.sent_ids and track_id not in self.pending_estimation:
                        package_img = frame[y1:y2, x1:x2]
                        if package_img.size > 0:
                            self.dimension_service.add_task(track_id, package_img)
                            self.pending_estimation.add(track_id)
                            logger.info(f"ESTIMATION STARTED for track_id {track_id}")
                    
                    if track_id in self.pending_estimation and self.dimension_service.has_result(track_id):
                        result = self.dimension_service.get_result(track_id)
                        
                        # Validation large pour testing
                        if (0.5 < result['length_cm'] < 300 and 
                            0.5 < result['width_cm'] < 300 and 
                            0.5 < result['height_cm'] < 300):
                            
                            dimensions_data = {
                                "type": "dimensions",
                                "id": track_id,
                                "length_cm": round(result['length_cm'], 2),
                                "width_cm": round(result['width_cm'], 2),
                                "height_cm": round(result['height_cm'], 2),
                                "length_px": w,
                                "width_px": h,
                            }
                            self.sent_ids.add(track_id)
                            self.pending_estimation.remove(track_id)
                            logger.info(f"VALID DIMENSIONS for track_id {track_id}")
                        else:
                            logger.warning(f"INVALID DIMENSIONS for track_id {track_id}: {result}")
                            self.pending_estimation.remove(track_id)

                # COULEURS SIMPLIFIÉES
                if force_green or (is_stable and is_high_quality):
                    color = (0, 255, 0)  # VERT
                    status = "READY"
                elif is_stable:
                    color = (0, 200, 255)  # ORANGE
                    status = "STABLE"
                else:
                    color = (0, 0, 255)  # ROUGE
                    status = "UNSTABLE"
                
                # Dessin de la bounding box
                cv2.rectangle(processed_frame, (x1, y1), (x2, y2), color, 3)
                
                # Texte d'information
                info_text = f"ID:{track_id} {status}"
                cv2.putText(processed_frame, info_text, (x1, y1 - 10), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
                
                # Texte de debug (score de qualité)
                debug_text = f"Q:{quality_score:.2f} S:{self.stable_counts[track_id]}"
                cv2.putText(processed_frame, debug_text, (x1, y1 - 35), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 1)

                tracked_objects.append(TrackedObject(track_id, (x1, y1, w, h)))

        return processed_frame, tracked_objects, dimensions_data