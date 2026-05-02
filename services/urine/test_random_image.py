import cv2
import urllib.request
import json
import requests

# Download a random dog image
urllib.request.urlretrieve("https://dog.ceo/api/breeds/image/random", "dog_api.json")
with open("dog_api.json") as f:
    data = json.load(f)
urllib.request.urlretrieve(data['message'], "dog.jpg")

# Send to API
url = 'http://localhost:5003/api/predict'
files = {'image': open('dog.jpg', 'rb')}
try:
    response = requests.post(url, files=files)
    print("Response Status Code:", response.status_code)
    print("Response JSON:", response.json())
except Exception as e:
    print("Error:", e)
