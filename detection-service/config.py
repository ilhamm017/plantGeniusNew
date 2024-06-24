from pydantic import BaseSettings 

class Settings(BaseSettings):
    MODEL_PATH: str = "saved_model"


settings = Settings()