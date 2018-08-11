const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blogs')


app.use(cors())
app.use(bodyParser.json())
app.use('/api/blogs', blogRouter)

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

let port = process.env.PORT
let mongoUrl = process.env.MONGODB_URI

if (process.env.NODE_ENV === 'test') {
  port = process.env.TEST_PORT
  mongoUrl = process.env.TEST_MONGODB_URI
}

mongoose.connect( mongoUrl, { useNewUrlParser: true } )

const server = http.createServer(app)

server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}