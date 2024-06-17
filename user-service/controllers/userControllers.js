const { User } = require('../models')
const service = require('../service/userService')
const { body, validationResult } = require('express-validator');


module.exports = {
    // Memasukkan data pengguna
    create : async (req, res) => {
        try {
            const dataUser = req.body
            // body('email').isEmail().withMessage('Email tidak valid')
            // body('nama').isLength({ min: 3 }).withMessage('Nama minimal 3 karakter')
            // TODO *Perbaikan validator 
            const newUser = await service.createUser(dataUser)
            res.status(201).json({ message : "Pengguna berhasil ditambahkan", newUser })
        } catch (error) {
            return res.status(500).json({ message : "Terjadi kesalahan saat memasukkan data pengguna", error: error.message })
        }
    },
    // Membaca data pengguna di database
    read : async (req, res) => {
        try {
            const allUsers = await service.getAllUsers()
            return res.status(202).json({ allUsers })
        } catch (error) {
            return res.status(500).json({ message : "Terjadi kesalahan saat membaca data pengguna", error: error.message})
        }
    },
    // Membaca data pengguna berdasarkan id di database
    readId : async (req, res) => {
        try {
            const { userId } = req.params
            const userById = await service.getUserById(userId)
            return res.status(202).json({ userById })
        } catch (error) {
            return res.status(500).json({ message : "Terjadi kesalahan saat membaca data pengguna", error: error.message})
        }
    },
    // Mengupdate data pengguna di database
    update : async (req, res) => {
        try {
            const { userId } = req.params
            const { email, nama } = req.body
            const dataUser = { email, nama, userId}
            body('email').isEmail().withMessage('Email tidak valid')
            body('nama').isLength({ min: 3 }).withMessage('Nama minimal 3 karakter')
            const updatedUser = await service.updateUser(dataUser)
            return res.status(202).json({ message : "Pengguna berhasil diupdate", updatedUser })
        } catch (error) {
            return res.status(500).json({ message : "Terjadi kesalahan saat mengupdate data pengguna", error: error.message })
        }
    },

    delete : async (req, res) => {
        //Menghapus data pengguna di database
        try {
            const { userId } = req.params
            const deletedUser = await service.deleteUser(userId)
            return res.status(202).json({ message : "Pengguna berhasil dihapus"})
        } catch (error) {
            return res.status(500).json({ message : "Terjadi kesalahan saat menghapus data pengguna"})
        }
    }
}