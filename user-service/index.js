const express = require('express');
const app = express()
const route = require('./routes/routes')
const port = process.env.PORT || 3000
app.use(express.json())
app.use(express.urlencoded({ extended: false}))

app.use('/user', route)

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})