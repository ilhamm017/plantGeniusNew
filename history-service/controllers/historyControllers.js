const service = require('../service/historyService')

module.exports = {
// Membuat hostroy baru
createHistory : async (req, res) => {
    try {
        const newHistory = req.body
        const userId = req.user.id
        const addHistory = await service.createHistory(newHistory, userId)
        return res.status(201).json({
            status: 'sukses',
            message: "Riwayat deteksi berhasil dibuat" 
        })
    } catch (error) {
        return res.status(500).json({
            status: 'gagal',
            message: error.message,
            error: 'Gagal dalam membuat history'
        });
    }
},
// Mendapatkan semua history 
getAllHistory : async (req, res) => {
  try {
      const userId = req.params.userId
      const tokenUserId = req.user.id
      const allHistory = await service.getAllHistory(userId, tokenUserId)
      return res.status(200).json({
          status: 'sukses',
          data: allHistory
    });
  } catch (error) {
    return res.status(500).json({
          status: 'error',
          message: error.message,
          error: 'Gagal dalam mendapatkan semua history'
    });
  }
},

// Mendapatkan hostroy berdasarkan ID
getHistoryById : async (req, res) => {
  try {
    const historyId = req.params.historyId
    const userId = req.user.id
    const userHistory = await service.getHistoryById(userId,historyId)
    return res.status(200).json({
      status: 'sukses',
      message: userHistory.message,
      data: userHistory.data
    });
  } catch (error) {
    return res.status(500).json({ 
      status: 'error',
      message: error.message,
      error: 'Gagal dalam mendapatkan history berdasarkan ID'
     });
  }
},

// hapus history berdasarkan ID
deleteHistory : async (req, res) => {
  try {
    const userId = req.user.id
    const deleteHistory = await service.deleteHistory(userId)
    return res.status(200).json({ 
      status: 'sukses',
      message: deleteHistory.message
    })
  } catch (error) {
    return res.status(500).json({ 
      error: 'Gagal dalam menghapus history',
      message: error.message
    });
  }
}

}