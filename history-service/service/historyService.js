

module.exports = {
    createHistory : async (historyData, userId) => {
        //membuat history baru
        try {
          const newHistory = await History.create({
            userId: userId,
            image: historyData.image,
            disease: historyData.disease
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
      getHistoryById : async (historyId) => {
        try {
          const historyEntry = await History.findOne({
            where : {
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
      deleteHistory : async (historyId) => {
        try {
          const historyEntry = await History.destroy({
            where : {
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
      }
}