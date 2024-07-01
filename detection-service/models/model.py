import tensorflow as tf
from config import settings #import pengaturan dari config.py
import io
from PIL import Image
import numpy as np 

diseases_class = [
    'Banana cordana', 'Banana healthy', 'Banana pestalotiopsis', 'Banana sigatoka', 'Cacao black pod rot',
        'Cacao healthy', 'Cacao pod borer', 'Cassava brown leaf spot', 'Cassava brown streak disease',
        'Cassava green mottle', 'Cassava healthy', 'Cassava mosaic disease', 'Cassava resistance marker',
        'Coffee cercospora', 'Coffee healthy', 'Coffee leaf rust', 'Coffee miner', 'Coffee phoma',
        'Corn cercospora leaf spot', 'Corn common rust', 'Corn northern leaf blight', 'Corn healthy',
        'Corn gray leaf spot', 'Guava canker', 'Guava dot', 'Guava healthy', 'Guava mummification',
        'Guava Rust', 'Mango anthracnose', 'Mango bacterial canker', 'Mango cutting weevil', 'Mango die back',
        'Mango gall midge', 'Mango healthy', 'Mango powdery mildew', 'Mango sooty mould',
        'Orange haunglongbing', 'Potato early blight', 'Potato late blight', 'Potato healthy', 'Rice sogatella',
        'Rice Tungro', 'Rice bacterial leaf blight', 'Rice brown spot', 'Rice healthy', 'Rice hispa',
        'Rice leaf blast', 'Soybean healthy', 'Squash powdery mildew', 'Tea anthracnose', 'Tea algal leaf',
        'Tea brown blight', 'Tea gray light', 'Tea healthy', 'Tea helopeltis', 'Tea red leaf spot', 'Tea white spot',
        'Tomato bacterial spot', 'Tomato early blight', 'Tomato late blight', 'Tomato leaf mold',
        'Tomato septoria leaf spot', 'Tomato spider mites', 'Tomato target spot', 'Tomato mosaic virus',
        'Tomato yellow leaf curl virus', 'Tomato healthy', 'Potato hollow heart'
] 

async def predict_disease(image: bytes) -> str:
    """melakukan prediksi penyakit pada gambar """
    model_path = settings.MODEL_PATH
    model = tf.saved_model.load(model_path)
    #preprocessing gambar
    image = Image.open(io.BytesIO(image))
    image = image.resize((150,150))
    x = tf.keras.preprocessing.image.img_to_array(image)
    x = np.expand_dims(x, axis=0)
    x = x / 255.0


    pred = model(x)
    index = np.argmax(pred)
    pred_diseases = diseases_class[index]

    return pred_diseases