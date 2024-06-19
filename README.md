## Endpoint untuk Setiap Service pada Aplikasi Pendeteksi Penyakit Tanaman:
 
 **Auth Service (/auth)**

-   **POST /register:** Registrasi user baru.
    
    -   **Request Body:** Email, password, nama.
        
    -   **Response:** User ID & Pesan Berhasil(jika berhasil), pesan error (jika gagal).
        
-   **POST /login:** Autentikasi user.
    
    -   **Request Body:** Email, password.
        
    -   **Response:** JWT (jika berhasil), pesan error (jika gagal).
        
**User Service (/users)**

-   **POST /create** Membuat data profil user baru (dipanggil oleh Auth Service).
    
    -   **Request Body:** Email, Nama.
        
    -   **Response:** Data user (ID, email, nama.).

-   **GET /** Mengambil semua data user yang terdaftar.
        
    -   **Response:** Data user (ID, email, nama).

-   **GET /:userId:** Mengambil data profil user yang sedang login.
    
    -   **Headers:** Authorization: Bearer
        
    -   **Response:** Data user (ID, email, nama, dll.).
        
-   **PUT /:userId:** Mengubah data profil user.
    
    -   **Headers:** Authorization: Bearer
        
    -   **Request Body:** Data user yang ingin diubah (nama, email, password).
        
    -   **Response:** Data user yang sudah diperbarui.
        
-   **GET /:userId:/history:** Mengambil riwayat deteksi user.
    
    -   **Headers:** Authorization: Bearer
        
    -   **Response:** Array data riwayat deteksi.
        
-   **GET /:userId:** Mengambil data profil user yang sedang login.
    
    -   **Headers:** Authorization: Bearer
        
    -   **Response:** Data user (ID, email, nama, dll).

-   **DELETE/:userId:** Menghapus data user yang sedang login.
    
    -   **Headers:** Authorization: Bearer
        
    -   **Response:** Pesan berhasil menghapus data user.

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

-   **POST /** Membuat riwayat baru setelah melakukan pendeteksian gambar (dipanggil oleh detection Service).
    
    -   **Headers:** Authorization: Bearer
        
    -   **Response:** Pesan history berhasil dibuat & Hasil analisis jenis penyakit.

-   **GET /:userId:** Mengambil riwayat deteksi berdasarkan user ID (dipanggil oleh User Service).
    
    -   **Headers:** (Opsional) Authorization: Bearer (jika diperlukan otorisasi)
        
    -   **Response:** Array data riwayat deteksi untuk user tersebut.

-   **GET /** Mengambil seluruh riwayat deteksi .
    
    -   **Headers:** (Opsional) Authorization: Bearer (jika diperlukan otorisasi)
        
    -   **Response:** Array data riwayat deteksi semua user.

-   **DELETE /:userId:** Menghapus riwayat deteksi berdasarkan user ID (dipanggil oleh User Service).
    
    -   **Headers:** Authorization: Bearer 
        
    -   **Response:** Pesan penghapusan berhasil, Pesan error (Jika gagal) 
