📦 BaridVision – Détection et Estimation du Poids Volumétrique des Colis
🚀 Description du projet

BaridVision est un système intelligent de vision par ordinateur permettant :

Détection et suivi des colis en temps réel

Annotation d’un dataset de colis via Roboflow

Entraînement d’un modèle YOLOv8 pour la détection

Ajout du suivi multi-objets en temps réel avec ByteTrack

Estimation des dimensions et calcul du poids volumétrique

Création d’un dataset personnalisé : images + fichier CSV des dimensions réelles (L, l, h)

Entraînement d’un modèle ConvNeXtV2-Large pour la régression des dimensions

Calcul du poids volumétrique selon la formule :
PV = (Longueur*Largeur*Hauteur)/5000
Comparaison avec le poids réel du colis et facturation basée sur le maximum des deux.

🛠️ Stack technologique

Deep Learning : YOLOv8 (Ultralytics), ConvNeXtV2-Large (timm)

Tracking : ByteTrack

Backend : FastAPI / Flask (selon version choisie)

Frontend : React / Next.js (interface caméra en temps réel)

Langages : Python, TypeScript/JavaScript

Outils : Roboflow (annotation), OpenCV, PyTorch

⚙️ Installation

Cloner le projet

git clone https://github.com/username/baridvision.git
cd baridvision


Installer les dépendances

pip install -r requirements.txt


Lancer le backend

uvicorn backend.app:app --reload


Lancer le frontend

cd frontend
npm install
npm run dev

▶️ Utilisation

Connecter une caméra (webcam ou caméra IP).

Lancer l’interface web pour la détection en temps réel.

Le système :

Détecte et suit chaque colis.

Estime ses dimensions (L, l, h).

Calcule le poids volumétrique et le compare au poids réel.

Affiche et enregistre la valeur retenue pour la facturation.

📊 Résultats attendus

Détection robuste et en temps réel des colis.

Estimation des dimensions avec une précision adaptée aux cas réels.

Calcul automatique du poids de facturation :

max(Poids_réel, Poids_volumétrique)


🔮 Améliorations futures

Optimisation du modèle pour embarqué (Jetson, Raspberry Pi).

Intégration de caméras multiples pour une meilleure estimation 3D.

Détection automatique d’objets interdits (phase 2 du projet).

Évaluation de l’état physique du colis (endommagé ou non).

👩‍💻 Auteure

Oumaima Mberik – Étudiante en Data Science, passionnée par l’IA appliquée à la vision par ordinateur.