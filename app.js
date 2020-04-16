if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require ('express') ;
const app = express() ;
const http = require('http').createServer(app) ;
const io = require('socket.io')(http) ;
const PORT = process.env.PORT || 4100;

  let positions= [
    {
      left: 90,
      x: 220,
      y: 300,
    },
    {
      left: 90,
      x: 220,
      y: 340,
    }
  ]

let firstId;
let secondId;

io.on('connection', socket => {    
    socket.emit('positions', positions);
    socket.on('move', data => {
        
        if(positions[0].left <= 0 || positions[1].left <= 0) {
            io.emit('winner', data.name)
            positions[0].left = 90
            positions[1].left = 90
            firstId = null
            secondId = null
        } else {

            // WHERE TURNS PLAY IN
            if(!firstId && !secondId) {
                firstId = data.id
                positions[0].left -= 5
            } 
            else if(firstId && !secondId && firstId !== data.id) {
                secondId = data.id
                positions[1].left -= 5; // left -5
            } 
            else if (firstId === data.id) {
                positions[0].left -= 5;
            }
            else if(secondId === data.id){
                positions[1].left -= 5;
            }

        }

        // WE ALWAYS EMIT POSITIONS, NO MATTER WHAT
        io.emit('positions', positions)

    })

    //End ON Events
    socket.on('disconnect', () => {
        positions[0].left = 90
        positions[1].left = 90
        firstId = null
        secondId = null
    })

})

http.listen(PORT, () => {
    console.log(`listening on PORT: ${PORT}`);
})