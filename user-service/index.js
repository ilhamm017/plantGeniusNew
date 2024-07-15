require('dotenv').config();
const express = require('express');
const app = express()
const route = require('./routes/routes')
const port = process.env.PORT || 3000
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use('/users', route)

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})