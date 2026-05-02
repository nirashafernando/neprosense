import requests
import numpy as np
import cv2

# Create a random image (noise)
img = np.random.randint(0, 256, (500, 500, 3), dtype=np.uint8)
cv2.imwrite('random_image.jpg', img)

# Send to API
url = 'http://localhost:5003/api/predict'
files = {'image': open('random_image.jpg', 'rb')}
try:
    response = requests.post(url, files=files)
    print("Response Status Code:", response.status_code)
    print("Response JSON:", response.json())
except Exception as e:
    print("Error:", e)
