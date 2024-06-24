from typing import list
import io
import base64
from fastapi import APIRouter, UploadFile, File 
from fastapi.response import JSONResponse
from models.model import predict_disease
from schemas import PredictionResponse 

#membuat router fastAPI
router = APIRouter(
    prefix="/predict",
    tags=["predictions"]
)

#Endpoint prediksi penyakit
@router.post("/")
async def predict_disease_from_image(request: Request):
    data = await request.json()
    image_data = base64.b64decode(data['image'])
    prediction = await predict_disease(image_data)
    return JSONResponse({
        "prediction": prediction
    })