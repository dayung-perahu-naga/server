require('dotenv').config()
const express = require ('express') ;
const app = express() ;
const http = require('http').createServer(app) ;
const io = require('socket.io')(http) ;
const PORT = process.env.PORT || 4100;

  let positions= [
    {
      left: 90,
      x: 220,
      y: 340,
    },
    {
      left: 90,
      x: 220,
      y: 340
    }
  ]

let firstId;
let secondId;

io.on('connection', socket => {    
    socket.emit('positions', positions);
    socket.on('move', data => {

        if(!firstId && !secondId) {
            firstId = data.id
            positions[0].left -= 5; // left -5
            if (positions[0].left <= 0 ) {
                positions[0].left = 90
                io.emit('positions', positions)
                io.emit('winner', data.name)
            } else {
                io.emit('positions', positions)
            }
            
        } else if(firstId && !secondId && firstId !== data.id) {
            positions[1].left -= 5; // left -5
                if (positions[1].left <= 0 ) {
                    positions[1].left = 90
                    io.emit('positions', positions)
                    io.emit('winner', data.name)
                } else {
                    io.emit('positions', positions)
                }

        } else if(firstId && secondId) {

        }
            if (firstId === data.id) {
                positions[0].left -= 5; // left -5
                if (positions[0].left <= 0 ) {
                    positions[0].left = 90
                    io.emit('positions', positions)
                    io.emit('winner', data.name)
                } else {
                    io.emit('positions', positions)
                }
            } else if(secondId === data.id){
                positions[1].left -= 5; // left -5
                if (positions[1].left <=0 ) {
                    positions[1].left = 90
                    io.emit('positions', positions)
                    io.emit('winner', data.name)
                } else {
                    io.emit('positions', positions)
                }
            }

    })

})

http.listen(PORT, () => {
    console.log(`listening on PORT: ${PORT}`);
})