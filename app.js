require('dotenv').config()

const express = require('express')
const http = require('http').Server(express)
const socketIo = require('socket.io')(http)
const port = process.env.port

let position = {
    x: 0
}

socketIo.on('connection', socket => {
    socket.emit('position', position);
    socket.on('move', data => {
        switch (data) {
            case "right":
                position.x += 10
                socketIo.emit('position', position)
                break;
            default:
                break;
        }
    })
})

http.listen(port, () => {
    console.log('Listening on port', port); 
})
