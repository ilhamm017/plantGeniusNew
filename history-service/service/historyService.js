const { History } = require('../models');
module.exports = {
    createHistory : async (historyData, userId) => {
        //membuat history baru
        try {
          const newHistory = await History.create({
            userId: userId,
            diseaseName: historyData.disease
          });
          return newHistory;
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
          return historyEntries;
        } catch (error) {
          throw error
        }
      },
      
      // Mendapatkan hostroy berdasarkan ID
      getHistoryById : async (userId, historyId) => {
        try {
          console.log(historyId, userId)
          const historyEntry = await History.findOne({
            where : {
                // userId : userId,
                id : historyId
            }
          })
          if (!historyEntry) {
            throw new Error('History tidak ditemukan');
          }
          return historyEntry;
        } catch (error) {
          throw error
        }
      },
      
      // hapus history berdasarkan ID
      deleteHistory : async (historyId, userId) => {
        try {
          const historyEntry = await History.destroy({
            where : {
                id : historyId,
                userId: userId
            }
          })
          if (!historyEntry) {
            throw new Error('History tidak ditemukan');
          }
          return historyEntry;
        } catch (error) {
          throw error
        }
      }
}