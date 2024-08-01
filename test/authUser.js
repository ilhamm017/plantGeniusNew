// ./auth-service/src/service/authService.test.js

const { createUser, login, update, deleteUser } = require('./authService');
const { UserAuth } = require('../models'); // Import model UserAuth
const { hashPassword, comparePassword } = require('../helpers/Hash'); // Import helper functions
const { sign } = require('../helpers/Jwt'); // Import helper functions


jest.mock('../models'); 
jest.mock('../helpers/Hash');
jest.mock('../helpers/Jwt');
jest.mock('./apiClientService');

describe('AuthService', () => {
  // Mock Data untuk Test
  const mockUserData = {
    email: 'test@example.com',
    password: 'password123',
  };

  const mockHashedPassword = 'hashedPassword123';
  const mockUser = {
    ...mockUserData,
    password: mockHashedPassword, 
    id: 1,
  };

  const mockToken = 'mockJwtToken';

  beforeEach(() => {
    jest.clearAllMocks(); // Reset mock sebelum setiap test
  });

  describe('createUser', () => {
    it('should successfully create a new user', async () => {
      UserAuth.findOne.mockResolvedValue(null); // Tidak ada user dengan email yang sama
      hashPassword.mockResolvedValue(mockHashedPassword);
      UserAuth.create.mockResolvedValue(mockUser);

      const result = await createUser(mockUserData);

      expect(UserAuth.findOne).toHaveBeenCalledWith({ where: { email: mockUserData.email } });
      expect(hashPassword).toHaveBeenCalledWith(mockUserData.password);
      expect(UserAuth.create).toHaveBeenCalledWith({
        email: mockUserData.email,
        password: mockHashedPassword, 
      });
      expect(result).toEqual({
        message: 'Berhasil menambahkan pengguna', 
        userId: mockUser.id,
      });
    });

    it('should throw an error if email already exists', async () => {
      UserAuth.findOne.mockResolvedValue(mockUser); // Simulasikan user sudah ada

      await expect(createUser(mockUserData)).rejects.toThrow(
        'Pengguna dengan email tersebut sudah terdaftar!'
      );
      expect(UserAuth.create).not.toHaveBeenCalled(); 
    });
  });

  describe('login', () => {
    it('should successfully log in a user', async () => {
      UserAuth.findOne.mockResolvedValue(mockUser);
      comparePassword.mockResolvedValue(true); // Password cocok
      sign.mockResolvedValue(mockToken);

      const result = await login(mockUserData);

      expect(UserAuth.findOne).toHaveBeenCalledWith({ where: { email: mockUserData.email } });
      expect(comparePassword).toHaveBeenCalledWith(mockUserData.password, mockHashedPassword);
      expect(sign).toHaveBeenCalledWith({ id: mockUser.id, email: mockUser.email  }); 
      expect(result).toBe(mockToken);
    });

    it('should throw an error if user not found', async () => {
      UserAuth.findOne.mockResolvedValue(null); 

      await expect(login(mockUserData)).rejects.toThrow('Email atau Password Salah!');
      expect(comparePassword).not.toHaveBeenCalled();
      expect(sign).not.toHaveBeenCalled();
    });

    it('should throw an error if password incorrect', async () => {
      UserAuth.findOne.mockResolvedValue(mockUser);
      comparePassword.mockResolvedValue(false); 

      await expect(login(mockUserData)).rejects.toThrow('Email atau Password Salah!');
      expect(sign).not.toHaveBeenCalled(); 
    });
  });

  describe('update', () => {
    it('should successfully update user data', async () => {
      const updatedData = { password: 'newPassword123' }; 
      const mockUpdatedUser = { ...mockUser, ...updatedData, password: mockHashedPassword };
      
      UserAuth.findOne.mockResolvedValue(mockUser);
      hashPassword.mockResolvedValue(mockHashedPassword);
      UserAuth.update.mockResolvedValue([1, [mockUpdatedUser]]); 

      const result = await update(mockUser.id, mockUser.id, updatedData); 

      expect(UserAuth.findOne).toHaveBeenCalledWith({ where: { id: mockUser.id } });
      expect(hashPassword).toHaveBeenCalledWith(updatedData.password); 
      expect(UserAuth.update).toHaveBeenCalledWith(
        { ...updatedData, password: mockHashedPassword }, // Pastikan password ter-hash 
        { where: { id: mockUser.id }, returning: true } 
      );
      expect(result).toEqual({
        message: 'Berhasil memperbarui data pengguna',
      });
    });

    // ... Tambahkan test case untuk skenario error (user tidak ditemukan, dll.) 
  });

  describe('deleteUser', () => {
    it('should successfully delete a user', async () => {
      UserAuth.destroy.mockResolvedValue(1); // 1 row deleted

      const result = await deleteUser(mockUser.id, mockUser.id);

      expect(UserAuth.destroy).toHaveBeenCalledWith({ where: { id: mockUser.id } });
      expect(result).toEqual({ message: 'User berhasil dihapus' });
    });

    // ... Tambahkan test case untuk skenario error (user tidak ditemukan, dll.) 
  });
});