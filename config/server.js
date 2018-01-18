const port = 4000

const bodyParser = require('body-parser')
const express= require('express')
const server = express()
const allowCors = require('./cors')
const queryParser = require('express-query-int')


server.use (bodyParser.urlencoded({extended:true}))
server.use(bodyParser.json())
server.use(allowCors)
server.use(queryParser())

server.listen(port,function (err) {
  if(err) console.log(err)
  console.log(`Backend is running on port ${port}.`)
})

module.exports = server
