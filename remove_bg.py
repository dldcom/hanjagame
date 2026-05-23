from rembg import remove
from PIL import Image
import os

images = [
    "public/aqua_leviathan.png",
    "public/ancient_forest_guardian.png",
    "public/thunder_tiger.png",
    "public/earth_titan.png"
]

for img_path in images:
    if os.path.exists(img_path):
        print(f"Processing {img_path}...")
        try:
            input_image = Image.open(img_path)
            output_image = remove(input_image)
            output_image.save(img_path)
            print(f"Successfully removed background from {img_path}")
        except Exception as e:
            print(f"Error processing {img_path}: {e}")
    else:
        print(f"File not found: {img_path}")
