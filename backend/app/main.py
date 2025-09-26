import cv2
import asyncio
import os
import json
import numpy as np
import torch
from fastapi import FastAPI, WebSocket
from app.yolov8 import YOLOv8Detector
import logging

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configuration modèle + tracker
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../models/best.pt")
TRACKER_CONFIG = os.path.join(os.path.dirname(__file__), "bytetrack.yaml")

# Instanciation du détecteur avec estimation des dimensions
detector = YOLOv8Detector(MODEL_PATH, TRACKER_CONFIG)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    cap = cv2.VideoCapture(0)  # webcam par défaut

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            # Détection + tracking + estimation dimensions avec le modèle entraîné
            processed_frame, tracks, dimensions_data = detector.process_frame(frame)

            # Envoyer UNIQUEMENT les dimensions estimées par le modèle (pas de fallback MiDaS)
            if dimensions_data:
                try:
                    await websocket.send_text(json.dumps(dimensions_data))
                    logger.info(f"Dimensions estimées envoyées: {dimensions_data}")
                except Exception as e:
                    logger.error(f"[WebSocket error] send dimensions: {e}")

            # Envoi frame encodée (pour affichage)
            _, buffer = cv2.imencode('.jpg', processed_frame, [int(cv2.IMWRITE_JPEG_QUALITY), 70])
            await websocket.send_bytes(buffer.tobytes())

            await asyncio.sleep(0.033)  # ~30 FPS

    except Exception as e:
        logger.error(f"[ERROR] WebSocket: {e}")
    finally:
        cap.release()