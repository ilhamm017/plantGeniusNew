const { where } = require('sequelize');
const { History } = require('../models');
const { httpError } = require('../../auth-service/helpers/httpError');
module.exports = {
    createHistory : async (historyData, userId) => {
        //membuat history baru
        try {
          if (!historyData && !userId) {
            throw new httpError(404, 'Hasil deteksi dan userId tidak ditemukan!')
          }
          const newHistory = await History.create({
            userId,
            diseaseName: historyData.disease
          });
          return {
            message: 'Berhasil membuat history'
          };
        } catch (error) {
          if (error.name === 'SequelizeValidationError') {
            const errorMsg = error.errors[0].message
            throw new httpError(400, errorMsg)
        }
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
          if (historyEntries.length === 0) {
            throw new httpError(404, 'History tidak ditemukan')
          }
          if (!historyEntries) {
            throw new httpError(500, 'Gagal mendapatkan history!')
          }
          if (userId != tokenUserId) {
            throw new httpError(401, 'Token tidak sesuai!')
          }
          return {
            userId,
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
              userId: userId,
              id : historyId
            }
          })
          if (!historyEntry) {
            throw new httpError(404, 'History tidak ditemukan!')
          }
          if (historyEntry.length === 0) {
            throw new httpError(404, 'History tidak ditemukan!')
          }
          if (!historyEntry) {
            throw new httpError(500, 'Gagal mendapatkan history')
          }
          if (userId != historyEntry.userId) {
            throw new httpError(401, 'Token tidak sesuai')
          }
          return {
            userId,
            message: 'Berhasil mendapatkan history',
            data: historyEntry
          }
        } catch (error) {
          throw error
        }
      },
      
      // hapus history berdasarkan ID
      deleteHistory : async (userId, tokenId) => {
        try {
          if (userId != tokenId) {
            throw new httpError(401, 'Token tidak sesuai!')
          }
          const historyData = await History.findOne({
            where : {
              userId
            }
          })
          if (!historyData) {
            throw new httpError(404, 'Tidak ada history!')
          }
          const historyEntry = await History.destroy({
            where : {
              userId
            }
          })
          return {
            message: `Berhasil menghapus history`
          }
        } catch (error) {
          if (error.statusCode == 404){
            return {
              message: 'Tidak ada history untuk dihapus!'
            }
          }
          throw error
        }
      }
}