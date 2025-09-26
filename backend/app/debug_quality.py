import cv2
import numpy as np
import os
import argparse

def analyze_image(image_path):
    """Analyse une image et calcule les scores de qualité"""
    if not os.path.exists(image_path):
        print(f"Fichier non trouvé: {image_path}")
        return
    
    image = cv2.imread(image_path)
    if image is None:
        print(f"Impossible de charger l'image: {image_path}")
        return
    
    print(f"\n=== Analyse de {os.path.basename(image_path)} ===")
    
    # 1. Taille et ratio d'aspect
    height, width = image.shape[:2]
    aspect_ratio = width / height if height > 0 else 0
    print(f"Taille: {width}x{height}, Ratio: {aspect_ratio:.2f}")
    
    # 2. Remplissage (non noir)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, binary = cv2.threshold(gray, 10, 255, cv2.THRESH_BINARY)  # Seuil bas pour éviter le noir
    fill_ratio = np.sum(binary > 0) / binary.size
    print(f"Remplissage: {fill_ratio:.3f}")
    
    # 3. Contours
    edges = cv2.Canny(gray, 50, 150)
    edge_ratio = np.sum(edges > 0) / edges.size
    print(f"Ratio de contours: {edge_ratio:.3f}")
    
    # 4. Lignes détectées
    lines = cv2.HoughLinesP(edges, 1, np.pi/180, threshold=30, minLineLength=20, maxLineGap=10)
    line_count = len(lines) if lines is not None else 0
    print(f"Lignes détectées: {line_count}")
    
    # 5. Score composite
    quality_score = min((fill_ratio * 0.4 + edge_ratio * 0.3 + (min(line_count, 10) / 10.0) * 0.3) * 1.5, 1.0)
    print(f"Score de qualité: {quality_score:.3f}")
    
    # 6. Visualisation
    debug_img = image.copy()
    if lines is not None:
        for line in lines:
            x1, y1, x2, y2 = line[0]
            cv2.line(debug_img, (x1, y1), (x2, y2), (0, 255, 0), 2)
    
    # Afficher l'image avec les lignes détectées
    cv2.imshow("Image analysée", debug_img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Analyse la qualité d'une image de colis")
    parser.add_argument("image_path", help="Chemin vers l'image à analyser")
    args = parser.parse_args()
    
    analyze_image(args.image_path)