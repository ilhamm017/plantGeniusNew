const tf = require('@tensorflow/tfjs-node')
const fs = require( 'fs' ).promises
const modelPath = './saved_model/model.json'
const disease_class = ['Banana cordana', 'Banana healthy', 'Banana pestalotiopsis', 'Banana sigatoka', 'Cacao black pod rot',
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
'Tomato yellow leaf curl virus', 'Tomato healthy', 'Potato hollow heart']

let model
async function loadModel() {
    try {
        model = await tf.loadLayersModel(`file:///${__dirname}/saved_model/model.json`);
        console.log('Model berhasil dimuat!');
        return model;
    } catch (error) {
        console.error('Gagal memuat model:', error)
    }
}

async function predictDisease(imagePath) {
    try {

        //Baca dan dekode gambar
        const imageBuffer = await fs.readFile(imagePath)
        const imageTensor = tf.node.decodeImage(imageBuffer)
        //Pra pemrosesan gambar
        const processedImage = tf.tidy(() => {
            const resized = tf.image.resizeBilinear(imageTensor, [150, 150])
            const normalized = resized.toFloat().div(255)
            const expanded = normalized.expandDims()
            return expanded
        })
        //Prediksi
        const prediction = model.predict(processedImage)
        const classIndex = prediction.argMax(1).dataSync()[0]
        const className = disease_class[classIndex]
        return Promise.resolve(className)
    } catch (error) {
        console.error('Gagal memprediksi:', error)
        return Promise.reject(error)
    }
}

(async () => {
    const imagePath = './images.jpeg'; // Path gambar
    loadModel()
    try {
      const predictedDisease = await predictDisease(imagePath);
      console.log('Penyakit yang diprediksi:', predictedDisease);
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
    }
  })();