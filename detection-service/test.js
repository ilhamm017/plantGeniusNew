const tf = require('@tensorflow/tfjs-node');

// Path ke model Anda (sesuaikan dengan struktur folder Anda)
const modelPath = `file:///${__dirname}/saved_model/model.json`; 

async function testLoadModel() {
  try {
    const model = await tf.loadLayersModel(modelPath);
    console.log("Model berhasil dimuat!");

    // Cetak ringkasan model (opsional)
    model.summary(); 

  } catch (error) {
    console.error("Gagal memuat model:", error.message);
  }
}

testLoadModel();