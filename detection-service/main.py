from fastapi import fastapi
from api.predict import router as predict_router

#membuat instance aplikasi FastAPI
app = fastapi(
    title="service detection plantGenius",
    version="0.0.1"
)

app.include_router(predict_router)
