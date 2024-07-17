const service = require('../service/historyService')

module.exports = {
// Membuat hostroy baru
createHistory : async (req, res) => {
  try {
    const newHistory = req.body
    const userId = req.user.id
    console.log(userId)
    const addHistory = await service.createHistory(newHistory, userId)
    return res.status(201).json({ 
      message: "Riwayat deteksi berhasil dibuat" 
    })
  } catch (error) {
    return res.status(500).json({ 
      error: 'Gagal dalam membuat history',
      message: error.message
    });
  }
},
// Mendapatkan semua history 
getAllHistory : async (req, res) => {
  try {
    const allHistory = await service.getAllHistory()
    return res.status(200).json(allHistory);
  } catch (error) {
    return res.status(500).json({ 
      error: 'Gagal dalam mendapatkan semua history',
      message: error.message
    });
  }
},

// Mendapatkan hostroy berdasarkan ID
getHistoryById : async (req, res) => {
  try {
    const historyId = req.params.id
    const userId = req.user.id
    const userHistory = await service.getHistoryById(userId, historyId)
    return res.status(200).json(userHistory);
  } catch (error) {
    return res.status(500).json({ 
      error: 'Gagal dalam mendapatkan history berdasarkan ID',
      message: error.message
     });
  }
},

// hapus history berdasarkan ID
deleteHistory : async (req, res) => {
  try {
    const historyId = req.params.id
    const userId = req.user.id
    const deleteHistory = await service.deleteHistory(historyId, userId)
    return res.status(204).json({ 
      historyId: historyId,
      message: "Riwayat deteksi berhasil dihapus" 
    });
  } catch (error) {
    return res.status(500).json({ 
      error: 'Gagal dalam menghapus history',
      message: error.message
    });
  }
}

}