# API Documentation: Plant Disease Detection App

## Autentikasi

### Auth Service (/auth)

#### POST /auth/register

**Deskripsi:** Mendaftarkan pengguna baru. Endpoint ini akan memanggil `POST /users/create` di User Service untuk membuat data pengguna jika registrasi berhasil.

**Request Body:**

| Parameter | Tipe Data | Deskripsi                |
| --------- | --------- | -------------------------- |
| email     | string    | Alamat email yang valid   |
| password  | string    | Kata sandi                |
| nama      | string    | Nama lengkap pengguna     |

**Response (201 Created):**

```json
{
  "status": "sukses",
  "message": "Berhasil menambahkan pengguna"
}
```

**Response (500 Internal Server Error):**

```json
{
  "status": "gagal",
  "message": "Terjadi kesalahan saat mendaftarkan pengguna",
  "error": "Pesan error" 
}
```

#### POST /auth/login

**Deskripsi:** Autentikasi pengguna.

**Request Body:**

| Parameter | Tipe Data | Deskripsi                |
| --------- | --------- | -------------------------- |
| email     | string    | Alamat email yang valid   |
| password  | string    | Kata sandi                |

**Response (200 OK):**

```json
{
  "status": "sukses",
  "message": "Login berhasil",
  "token": "JWT token"
}
```

**Response (500 Internal Server Error):**

```json
{
  "status": "error",
  "message": "terjadi kesalahan saat login",
  "error": "Pesan error"
}
```

## User Service (/users)

#### POST /users/create

**Deskripsi:** Membuat profil pengguna baru (dipanggil oleh Auth Service).

**Headers:**

* Authorization: Bearer <jwt_token>

**Request Body:**

| Parameter | Tipe Data | Deskripsi                |
| --------- | --------- | -------------------------- |
| email     | string    | Alamat email yang valid   |
| nama      | string    | Nama lengkap pengguna     |
| userId     | string    | ID User dari Auth Service |

**Response (201 Created):**

```json
{
  "status": "sukses",
  "message" : "Berhasil menambahkan pengguna",
  "userId" : 123 
}
```

**Response (500 Internal Server Error):**

```json
{ 
  "status": "error",
  "message" : "Terjadi kesalahan saat memasukkan data pengguna", 
  "error": "Pesan error"
}
```

#### GET /users

**Deskripsi:** Mengambil data semua pengguna.

**Headers:**

* Authorization: Bearer <jwt_token>

**Response (200 OK):**

```json
{
  "status": "sukses",
  "message": "Berhasil mendapatkan data pengguna",
  "data": [
    {
      "id": 1,
      "nama": "Nama Pengguna 1",
      "email": "pengguna1@example.com",
      "userId": 123,
      // ... kolom lainnya
    },
    // ... data pengguna lainnya
  ]
}
```

**Response (500 Internal Server Error):**

```json
{
  "status": "error",
  "message" : "Terjadi kesalahan saat membaca data pengguna", 
  "error": "Pesan error"
}
```

#### GET /users/:userId

**Deskripsi:** Mengambil data profil pengguna berdasarkan ID.

**Headers:**

* Authorization: Bearer <your_jwt_token>

**Response (202 Accepted):**

```json
{
  "status": "sukses",
  "message": "Berhasil mendapatkan data pengguna",
  "data": {
    "id": 1,
    "nama": "Nama Pengguna 1",
    "email": "pengguna1@example.com",
    "userId": 123,
    // ... kolom lainnya 
  }
}
```

**Response (500 Internal Server Error):**

```json
{
  "status": "error",
  "message" : "Terjadi kesalahan saat membaca data pengguna",
  "error": "Pesan error"
}
```

#### PUT /users/:userId

**Deskripsi:** Mengubah data profil pengguna. Endpoint ini akan melakukan update data user di Auth Service jika field `email` diubah.

**Headers:**

* Authorization: Bearer <jwt_token>

**Request Body:**

| Parameter | Tipe Data | Deskripsi                        |
| --------- | --------- | ---------------------------------- |
| nama      | string    | Nama lengkap pengguna (opsional) |
| email     | string    | Alamat email (opsional)           |

**Response (202 Accepted):**

```json
{
  "status": "sukses",
  "message" : "Berhasil memperbarui data pengguna dengan id {userId}" 
}
```

**Response (500 Internal Server Error):**

```json
{
  "message" : "Terjadi kesalahan saat memperbarui data pengguna",
  "error": "Pesan error"
}
```

#### DELETE /users/:userId

**Deskripsi:** Menghapus data pengguna. Endpoint ini akan memanggil `DELETE /auth/{userId}` di Auth Service dan `DELETE /history/{userId}` di History Service.

**Headers:**

* Authorization: Bearer <your_jwt_token>

**Response (202 Accepted):**

```json
{
  "status" : "sukses",
  "message" : "Pengguna dengan id {userId} berhasil dihapus" 
}
```

**Response (500 Internal Server Error):**

```json
{
  "message" : "Terjadi kesalahan saat menghapus data pengguna",
  "error": "Pesan error"
}
```

## Image Upload & Detection

### Image Upload Service (/images)

#### POST /images/upload

**Deskripsi:** Mengunggah gambar tanaman untuk dideteksi. Endpoint ini akan memanggil endpoint `POST /history` di History Service untuk mencatat riwayat deteksi.

**Headers:**

* Authorization: Bearer <jwt_token>
* Content-Type: multipart/form-data

**Request Body:**

* `image`: File gambar (Base64)

**Response (201 Created):**

```json
{
  "status": "sukses",
  "message": "Deteksi berhasil",
  "data": "Hasil prediksi penyakit"
}
```

**Response (500 Internal Server Error):**

```json
{
  "status": "error",
  "message": "Terjadi kesalahan!!",
  "error": "Pesan error"
}
```

## History Service (/history)

#### POST /history

**Deskripsi:** Membuat riwayat deteksi baru (dipanggil oleh Image Upload Service).

**Headers:**

* Authorization: Bearer <jwt_token>

**Request Body:**

| Parameter  | Tipe Data | Deskripsi                  |
| ---------- | --------- | ---------------------------- |
| disease    | string    | Jenis penyakit yang terdeteksi|

**Response (201 Created):**

```json
{
  "status": "sukses",
  "message": "Riwayat deteksi berhasil dibuat" 
}
```

**Response (500 Internal Server Error):**

```json
{
  "status": "gagal",
  "message": "Pesan error",
  "error": "Gagal dalam membuat history"
}
```

#### GET /history/:id

**Deskripsi:** Mengambil riwayat deteksi berdasarkan user ID.

**Headers:**

* Authorization: Bearer <your_jwt_token>

**Response (200 OK):**

```json
{
  "status": "sukses",
  "message": "Berhasil mendapatkan history",
  "data": {
    "id": 1,
    "userId": 123,
    "diseaseName": "Penyakit X",
    "createdAt": "2023-10-27T07:10:27.916Z",
    "updatedAt": "2023-10-27T07:10:27.916Z"
  }
}
```

**Response (500 Internal Server Error):**

```json
{ 
  "status": "error",
  "message": "Pesan error",
  "error": "Gagal dalam mendapatkan history berdasarkan ID"
}
```

#### GET /history

**Deskripsi:** Mengambil seluruh riwayat deteksi.

**Headers:**

* Authorization: Bearer <jwt_token>

**Response (200 OK):**

```json
{
  "status": "sukses",
  "data": [
    {
      "id": 1,
      "userId": 123, 
      "diseaseName": "Penyakit X",
      "createdAt": "2023-10-27T07:10:27.916Z",
      "updatedAt": "2023-10-27T07:10:27.916Z"
    },
    // ... data riwayat lainnya
  ]
}
```

**Response (500 Internal Server Error):**

```json
{
  "status": "error",
  "message": "Pesan error",
  "error": "Gagal dalam mendapatkan semua history"
}
```

#### DELETE /history/:id

**Deskripsi:** Menghapus riwayat deteksi berdasarkan ID.

**Headers:**

* Authorization: Bearer <jwt_token>

**Response (204 No Content):**

```json
{ 
  "status": "sukses",
  "message": "Berhasil menghapus history dengan ID {id}"
}
```

**Response (500 Internal Server Error):**

```json
{ 
  "error": "Gagal dalam menghapus history",
  "message": "Pesan error"
}
```

## Catatan Umum

* Semua endpoint yang membutuhkan autentikasi JWT harus menyertakan token di header dengan format `Authorization: Bearer <jwt_token>`.
* Dokumentasi ini dapat diperbarui dengan informasi lebih lanjut mengenai error handling dan validasi data. 
