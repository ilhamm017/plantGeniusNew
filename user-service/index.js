const express = require('express');
const app = express()
const port = 3000 // Ubah env port ketika sudah selesai 

app.get('/user', (req, res) => {
    res.send('hello world')
}) // Ganti menggunakan route 

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})