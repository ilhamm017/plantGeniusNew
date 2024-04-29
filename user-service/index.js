const express = require('express');
const app = express()
const route = require('./routes/routes')
const port = 3000 // Ubah env port ketika sudah selesai 

app.use(express.json())
app.use(express.urlencoded({ extended: false}))

app.use('/user', route)

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})