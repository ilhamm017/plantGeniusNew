const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const route = require('./routes/routes')

app.use(express.json())
app.use(express.urlencoded({ extended: false}))

app.use('/history', route)

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})

