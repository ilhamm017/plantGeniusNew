from typing import List
import io
import base64
from fastapi import  APIRouter, Request, Request, HTTPException
from fastapi.responses import JSONResponse
from models.model import predict_disease
from schemas import PredictionResponse 
import json

#membuat router fastAPI
router = APIRouter(
    prefix="/predict",
    tags=["predictions"]
)

#Endpoint prediksi penyakit
@router.post("/")
async def predict_disease_from_image(request: Request):
    try:
        data = await request.json()
        print("Data:", data)
        if 'image' not in data:
           return JSONResponse({
               "message": "Gambar tidak ditemukan"
           }, status_code=400)
       
        try:
           image_data = base64.b64decode(data['image'])
           print("Image Data:", image_data)
        except Exception as e:
            return JSONResponse({
                "message": "Invalid base64 data"
            }, status_code=400)
        
        prediction = await predict_disease(image_data)
        print("Prediction:", prediction)
        return JSONResponse({
            "prediction" : prediction
        })
    
    except Exception as e:
        return JSONResponse({
            "message" : "Internal server Error"
        }, status_code=500)
    