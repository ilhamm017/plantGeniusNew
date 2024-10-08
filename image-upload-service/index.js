require('dotenv').config();
const express = require('express')
const app = express()
const port = process.env.PORT
const route = require('./routes/uploadRoute')

app.use(express.json())
app.use(express.urlencoded({ extended: false}))

app.use('/upload', route)

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})
