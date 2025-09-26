import cv2
import numpy as np
import csv
import os
from datetime import datetime

def draw_bounding_boxes(frame, objects):
    for obj in objects:
        if obj['confidence'] > 0.7:
            x1, y1, x2, y2 = map(int, obj['bbox'])
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(
                frame, 
                f"ID: {obj['id']} {obj['confidence']:.2f}", 
                (x1, y1 - 10), 
                cv2.FONT_HERSHEY_SIMPLEX, 
                0.9, (0, 255, 0), 2
            )
    return frame

def extract_dims_from_depth(bbox, depth_map):
    """
    bbox = (x, y, w, h) en pixels
    depth_map = carte de profondeur en float numpy array

    Retourne:
    length_px, width_px, mean_depth (hauteur estimée)
    """
    x, y, w, h = map(int, bbox)
    bbox_depth = depth_map[y:y+h, x:x+w]

    if bbox_depth.size == 0:
        return None

    mean_depth = float(np.median(bbox_depth))
    return w, h, mean_depth  # longueur, largeur, hauteur estimée

def save_dimensions_to_csv(track_id, L, l, h, filename="dimensions.csv"):
    file_exists = os.path.isfile(filename)
    with open(filename, mode='a', newline='') as csv_file:
        writer = csv.writer(csv_file)
        if not file_exists:
            writer.writerow(['timestamp', 'track_id', 'length_px', 'width_px', 'height_depth'])

        timestamp = datetime.now().isoformat()
        writer.writerow([timestamp, track_id, round(L, 2), round(l, 2), round(h, 2)])
