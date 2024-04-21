const express = require('express')
const app = express()
const port = 3000
const route = require('./src/routes/routes')

app.use(express.json())
app.use(express.urlencoded({ extended: false}))

app.use('/auth', route)

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})

