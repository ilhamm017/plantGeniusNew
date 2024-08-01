const { History } = require('../models');
module.exports = {
    createHistory : async (historyData, userId) => {
        //membuat history baru
        try {
          const newHistory = await History.create({
            userId: userId,
            diseaseName: historyData.disease
          });
          return {
            message: 'Berhasil membuat history'
          };
        } catch (error) {
          throw error
        }
      },
      
      // Mendapatkan semua history 
      getAllHistory : async () => {
        try {
          const historyEntries = await History.findAll();
          if (!historyEntries) {
            throw new Error('Tidak ditemukan history');
          }
          if (historyEntries.length === 0) {
            throw new Error('Tidak ada history')
        }
          return {
            message: 'Berhasil mendapatkan history',
            data: historyEntries
          }
        } catch (error) {
          throw error
        }
      },
      
      // Mendapatkan hostroy berdasarkan ID
      getHistoryById : async (userId, historyId) => {
        try {
          if (userId != historyId) {
            throw new Error('Token tidak sesuai')
          }
          const historyEntry = await History.findOne({
            where : {
                userId : userId,
                id : historyId
            }
          })
          if (!historyEntry) {
            throw new Error('History tidak ditemukan');
          }
          if (userHistory.length === 0) {
            throw new Error('History tidak ditemukan')
          }
          return {
            message: 'Berhasil mendapatkan history',
            data: historyEntry
          }
        } catch (error) {
          throw error
        }
      },
      
      // hapus history berdasarkan ID
      deleteHistory : async (historyId, userId) => {
        try {
          if (userId != historyId) {
            throw new Error('Token tidak sesuai')
          }
          const historyEntry = await History.destroy({
            where : {
              userId: userId,
                id : historyId
            }
          })
          if (!historyEntry) {
            throw new Error('History tidak ditemukan');
          }
          return {
            message: `Berhasil menghapus history dengan ID ${historyId}`
          };
        } catch (error) {
          throw error
        }
      }
}