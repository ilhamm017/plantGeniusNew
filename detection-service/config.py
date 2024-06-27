from pydantic_settings import BaseSettings 

class Settings(BaseSettings):
    MODEL_PATH: str = "saved_model"


settings = Settings()