const { History } = require('../models');
const service = require('../service/historyService')

module.exports = {
// Membuat hostroy baru
createHistory : async (req, res) => {
  try {
    const newHistory = req.body
    const userId = req.user.id
    const addHistory = await service.createHistory(newHistory, userId)
    res.ststus(201).json({ 
      message: "Riwayat deteksi berhasil dibuat" 
    })
  } catch (error) {
    res.status(500).json({ 
      error: 'Gagal dalam membuat history',
      message: error.message
    });
  }
},
// Mendapatkan semua history 
getAllHistory : async (req, res) => {
  try {
    const allHistory = await service.getAllHistory()
    res.status(200).json(allHistory);
  } catch (error) {
    res.status(500).json({ 
      error: 'Gagal dalam mendapatkan semua history',
      message: error.message
    });
  }
},

// Mendapatkan hostroy berdasarkan ID
getHistoryById : async (req, res) => {
  try {
    const userId = req.user.id
    const userHistory = await service.getHistoryById(userId)
    res.status(200).json(userHistory);
  } catch (error) {
    res.status(500).json({ 
      error: 'Gagal dalam mendapatkan history berdasarkan ID',
      message: error.message
     });
  }
},

// hapus history berdasarkan ID
deleteHistory : async (req, res) => {
  try {
    const historyId = req.user.id
    const deleteHistory = await service.deleteHistory(historyId)
    res.status(204).json({ 
      message: "Riwayat deteksi berhasil dihapus" 
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Gagal dalam menghapus history',
      message: error.message
    });
  }
}

}