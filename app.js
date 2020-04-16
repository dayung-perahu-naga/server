require('dotenv').config()

const express = require('express')
const http = require('http').Server(express)
const socketIo = require('socket.io')(http)
const port = process.env.port

http.listen(port, () => {
    console.log('Listening on port', port); 
})
