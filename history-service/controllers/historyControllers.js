const service = require('../service/historyService')

module.exports = {
// Membuat hostroy baru
createHistory : async (req, res) => {
    try {
        const newHistory = req.body
        const userId = req.user.id
        const addHistory = await service.createHistory(newHistory, userId)
        if (!addHistory) {
            throw new Error('Gagal menambahkan history')
        }
        return res.status(201).json({
            status: 'sukses',
            message: "Riwayat deteksi berhasil dibuat" 
        })
    } catch (error) {
        return res.status(500).json({
            status: 'gagal',
            error: 'Gagal dalam membuat history',
            message: error.message
        });
    }
},
// Mendapatkan semua history 
getAllHistory : async (req, res) => {
  try {
      const allHistory = await service.getAllHistory()
      if (allHistory.length === 0) {
          throw new Error('Tidak ada history')
      }
      return res.status(200).json({
          status: 'sukses',
          data: allHistory
    });
  } catch (error) {
    return res.status(500).json({
          status: 'error',
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

    if (userHistory.length === 0) {
      throw new Error('History tidak ditemukan')
    }
    return res.status(200).json({
      status: 'sukses',
      data: userHistory
    });
  } catch (error) {
    return res.status(500).json({ 
      status: 'error',
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
    if (!deleteHistory) {
      throw new Error('Riwayat deteksi tidak ditemukan')
    }
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