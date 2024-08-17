const { where } = require('sequelize');
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
      getAllHistory : async (userId,tokenUserId) => {
        try {
          const historyEntries = await History.findAll({
            where: {
              userId
            }
          });
          if (!historyEntries) {
            throw new Error('Tidak ditemukan history');
          }
          if (historyEntries.length === 0) {
            throw new Error('Tidak ada history')
          }
          if (userId != tokenUserId) {
            throw new Error('Token tidak sesuai')
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
          const historyEntry = await History.findOne({
            where : {
              userId : userId,
              id : historyId
            }
          })
          if (!historyEntry) {
            throw new Error('History tidak ditemukan');
          }
          if (historyEntry.length === 0) {
            throw new Error('History tidak ditemukan')
          }
          if (userId != historyEntry.userId) {
            throw new Error('Token tidak sesuai')
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
      deleteHistory : async (userId) => {
        try {
          const historyData = await History.findOne({
            where : {
              userId
            }
          })
          if (!historyData) { 
            return {
              message : 'Tidak ada history untuk dihapus'
            }
          }
          if (userId != historyData.userId) {
            throw new Error('Token tidak sesuai')
          }
          const historyEntry = await History.destroy({
            where : {
              userId
            }
          })
          if (!historyEntry) {
            throw new Error('Gagal menghapus History');
          }
          return {
            message: `Berhasil menghapus history`
          }
        } catch (error) {
          throw error
        }
      }
}