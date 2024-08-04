const request = require('supertest');
const chai = require('chai');
const expect = chai.expect; // Assertion style yang umum digunakan
const baseUrl = 'http://localhost:3000'; // Ganti dengan URL API Anda

describe('API Testing for Plant Disease Detection App', () => {

  describe('Auth Service (/auth)', () => {

    describe('POST /auth/register', () => {
      it('should register a new user with valid data', (done) => {
        const newUser = {
          email: 'testuser@example.com',
          password: 'securepassword',
          nama: 'Test User'
        };

        request(baseUrl)
          .post('/auth/register')
          .send(newUser)
          .expect(201)
          .expect('Content-Type', /json/)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.status).to.equal('sukses');
            expect(res.body.message).to.equal('Berhasil menambahkan pengguna');
            done();
          });
      });

      // Tambahkan test case lain untuk skenario gagal di registrasi
    });

    // Tambahkan test case untuk POST /auth/login
  });

  // Tambahkan test case untuk endpoint lain di User Service, Image Upload Service, dan History Service

});