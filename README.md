
# API Documentation: Plant Disease Detection App

## Autentikasi

### Auth Service (/auth)

#### POST /auth/register

**Deskripsi:** Mendaftarkan pengguna baru.

**Request Body:**

| Parameter | Tipe Data | Deskripsi                |
| --------- | --------- | -------------------------- |
| email     | string    | Alamat email yang valid   |
| password  | string    | Kata sandi                |
| nama      | string    | Nama lengkap pengguna     |

**Response (201 Created):**

```json
{
  "message": "User berhasil terdaftar",
  "userId": "1234" 
}
```

**Response (400 Bad Request):**

```json
{
  "message": "Email sudah terdaftar"
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
  "token": "your_jwt_token"
}
```

**Response (401 Unauthorized):**

```json
{
  "message": "Email atau password salah"
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

**Response (201 Created):**

```json
{
  "id": "1234",
  "email": "user@example.com",
  "nama": "Nama Pengguna"
}
```

#### GET /users

**Deskripsi:** Mengambil data semua pengguna (Admin Only).

**Headers:**

* Authorization: Bearer <jwt_token>

**Response (200 OK):**

```json
[
  {
    "id": "1234",
    "email": "user1@example.com",
    "nama": "Nama Pengguna 1"
  },
  {
    "id": "987",
    "email": "user2@example.com",
    "nama": "Nama Pengguna 2"
  }
]
```

#### GET /users/:userId

**Deskripsi:** Mengambil data profil pengguna berdasarkan ID.

**Headers:**

* Authorization: Bearer <your_jwt_token>

**Response (200 OK):**

```json
{
  "id": "1234",
  "email": "user@example.com",
  "nama": "Nama Pengguna"
}
```

#### PUT /users/:userId

**Deskripsi:** Mengubah data profil pengguna.

**Headers:**

* Authorization: Bearer <jwt_token>

**Request Body:**

| Parameter | Tipe Data | Deskripsi                        |
| --------- | --------- | ---------------------------------- |
| nama      | string    | Nama lengkap pengguna (opsional) |
| email     | string    | Alamat email (opsional)           |
| password  | string    | Kata sandi (opsional)            |

**Response (200 OK):**

```json
{
  "message": "Profil berhasil diperbarui"
}
```

#### DELETE /users/:userId

**Deskripsi:** Menghapus data pengguna.

**Headers:**

* Authorization: Bearer <your_jwt_token>

**Response (200 OK):**

```json
{
  "message": "User berhasil dihapus"
}
```

## Image Upload & Detection

### Image Upload Service (/images)

#### POST /images/upload

**Deskripsi:** Mengunggah gambar tanaman untuk dideteksi.

**Headers:**

* Authorization: Bearer <jwt_token>
* Content-Type: multipart/form-data

**Request Body:**

* `image`: File gambar

**Response (200 OK):**

```json
{
  "message": "Gambar berhasil diunggah dan diproses",
  "result": {
    "disease": "Penyakit Busuk Daun"
  }
}
```

**Response (400 Bad Request):**

```json
{
  "message": "Gagal memproses gambar."
}
```

### Detection Service (/detection)

#### POST /detection/analyze

**Deskripsi:** Menganalisis gambar tanaman (dipanggil oleh Image Upload Service).

**Request Body:**

* File gambar (dikirim dari Image Upload Service)

**Response:**

* Hasil analisis (jenis penyakit) - dikirim kembali ke Image Upload Service

## History Service (/history)

#### POST /history

**Deskripsi:** Membuat riwayat deteksi baru (dipanggil oleh Image Upload Service).

**Headers:**

* Authorization: Bearer <jwt_token>

**Request Body:**

| Parameter  | Tipe Data | Deskripsi                  |
| ---------- | --------- | ---------------------------- |
| userId     | string    | ID Pengguna               |
| imageUrl   | string    | URL gambar yang diunggah  |
| disease    | string    | Jenis penyakit yang terdeteksi|
| accuracy   | float     | Tingkat akurasi deteksi  |

**Response (201 Created):**

```json
{
  "message": "Riwayat deteksi berhasil dibuat"
}
```

#### GET /history/:userId

**Deskripsi:** Mengambil riwayat deteksi berdasarkan user ID.

**Headers:**

* Authorization: Bearer <your_jwt_token>

**Response (200 OK):**

```json
[
  {
    "id": "1",
    "userId": "1234",
    "imageUrl": "lokasi image",
    "disease": "Penyakit Busuk Daun",
    "createdAt": "2023-10-26T10:00:00Z"
  },
  {
    "id": "2",
    "userId": "12345",
    "imageUrl": "lokasi image",
    "disease": "Penyakit Bercak Daun",
    "createdAt": "2023-10-27T15:30:00Z"
  }
]
```

#### GET /history

**Deskripsi:** Mengambil seluruh riwayat deteksi (Admin Only).

**Headers:**

* Authorization: Bearer <jwt_token>

**Response (200 OK):**

```json
[
  // ... (Similar structure to GET /history/:userId)
]
```

#### DELETE /history/:historyId

**Deskripsi:** Menghapus riwayat deteksi berdasarkan ID.

**Headers:**

* Authorization: Bearer <jwt_token>

**Response (200 OK):**

```json
{
  "message": "Riwayat deteksi berhasil dihapus"
}
```


