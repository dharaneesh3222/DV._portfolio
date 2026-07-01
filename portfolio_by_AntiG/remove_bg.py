from rembg import remove
from PIL import Image

input_path = 'My Photo.jpeg'
output_path = 'assets/profile.png'

try:
    input = Image.open(input_path)
    output = remove(input)
    output.save(output_path)
    print("Background removed successfully!")
except Exception as e:
    print(f"Error: {e}")
