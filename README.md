## Endpoint untuk Setiap Service pada Aplikasi Pendeteksi Penyakit Tanaman:
 
 **Auth Service (/auth)**

-   **POST /register:** Registrasi user baru.
    
    -   **Request Body:** Email, password, nama.
        
    -   **Response:** User ID & Pesan Berhasil(jika berhasil), pesan error (jika gagal).
        
-   **POST /login:** Autentikasi user.
    
    -   **Request Body:** Email, password.
        
    -   **Response:** JWT (jika berhasil), pesan error (jika gagal).
        
**User Service (/users)**

-   **GET /:id:** Mengambil data profil user yang sedang login.
    
    -   **Headers:** Authorization: Bearer
        
    -   **Response:** Data user (ID, email, nama, dll.).
        
-   **PUT /:id:** Mengubah data profil user.
    
    -   **Headers:** Authorization: Bearer
        
    -   **Request Body:** Data user yang ingin diubah (nama, email, password).
        
    -   **Response:** Data user yang sudah diperbarui.
        
-   **GET /:id:/history:** Mengambil riwayat deteksi user.
    
    -   **Headers:** Authorization: Bearer
        
    -   **Response:** Array data riwayat deteksi.
        

**Image Upload Service (/images)**

-   **POST /upload:** Mengunggah gambar tanaman.
    
    -   **Headers:** Authorization: Bearer
        
    -   **Request Body:** File gambar (multipart/form-data).
        
    -   **Response:** Hasil deteksi penyakit tanaman, pesan error (jika gagal).
        

**Detection Service (/detection)**

-   **POST /analyze:** Menganalisis gambar tanaman (dipanggil oleh Image Upload Service).
    
    -   **Request Body:** File gambar.
        
    -   **Response:** Hasil analisis (jenis penyakit).
        

**History Service (/history)**

-   **GET /:userId:** Mengambil riwayat deteksi berdasarkan user ID (dipanggil oleh User Service).
    
    -   **Headers:** (Opsional) Authorization: Bearer (jika diperlukan otorisasi)
        
    -   **Response:** Array data riwayat deteksi untuk user tersebut.
