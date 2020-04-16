require('dotenv').config()
const express = require ('express') ;
const app = express() ;
const http = require('http').createServer(app) ;
const io = require('socket.io')(http) ;
const PORT = process.env.PORT || 3000;

let positions= [
    {
      right: 80,
      x: 100,
      y: 500,
    },
    {
      right: 80,
      x: 100,
      y: 620
    }
  ]

let firstId;
let secondId;

io.on('connection', socket => {    
    socket.emit('positions', positions);
    socket.on('move', data => {

        if(!firstId && !secondId) {
            firstId = data.id
            positions[0].right += 5; // right +5
            if (positions[0].right <=0 ) {
                positions[0].right = 0
                io.emit('positions', positions)
                io.emit('winner', data.name)
            } else {
                io.emit('positions', positions)
            }
            
        } else if(firstId && !secondId && firstId !== data.id) {
            positions[1].right += 5; // right -5
                if (positions[1].right <=0 ) {
                    positions[1].right = 0
                    io.emit('positions', positions)
                    io.emit('winner', data.name)
                } else {
                    io.emit('positions', positions)
                }

        } else if(firstId && secondId) {

        }
            if (firstId === data.id) {
                positions[0].right += 5; // right -5
                if (positions[0].right <=0 ) {
                    positions[0].right = 0
                    io.emit('positions', positions)
                    io.emit('winner', data.name)
                } else {
                    io.emit('positions', positions)
                }
            } else if(secondId === data.id){
                positions[1].right += 5; // right -5
                if (positions[1].right <=0 ) {
                    positions[1].right = 0
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