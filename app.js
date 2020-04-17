if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require ('express') ;
const app = express() ;
const http = require('http').createServer(app) ;
const io = require('socket.io')(http) ;
const PORT = process.env.PORT || 3000;


let positions= [
    {
        left: 80,
        x: 620,
        y: 340,
    },
    {
        left: 80,
        x: 620,
        y: 340
    }
]

let firstId;
let secondId;
let players = []


io.on('connection', socket => {  


    positions[0].left = 80
    positions[1].left = 80
    firstId = null
    secondId = null

    if ( players.length >= 2 ){
         players = []
    }
    
    socket.on('players', player =>  {
        players.push(player)
        console.log(players);
        io.emit('playerName', players)
    })

    socket.on('disconnect', playerName => {
        console.log(playerName + 'disconnect');
        
        players = players.filter(el => {
            return el !== playerName
        })
    })
    
    socket.emit('positions', positions);
    socket.on('move', data => {

        if(!firstId && !secondId) {
            firstId = data.id
            positions[0].left -= 5; // left -5
            if (positions[0].left <=0 ) {
                io.emit('positions', positions)
                io.emit('winner', data.name)
            } else {
                io.emit('positions', positions)
            }
            
        } else if(firstId && !secondId && firstId !== data.id) {
                 positions[1].left -= 5; // left -5
                if (positions[1].left <=0 ) {
                    io.emit('positions', positions)
                    io.emit('winner', data.name)
                } else {
                    io.emit('positions', positions)
                }

        } else if(firstId && secondId) {
          
        }
            if (firstId === data.id) {
                positions[0].left -= 5; // left -5
                if (positions[0].left <=0 ) {
                    io.emit('positions', positions)
                    io.emit('winner', data.name)
                } else {
                    io.emit('positions', positions)
                }
            } else if(secondId === data.id){
                positions[1].left -= 2; // left -5
                if (positions[1].left <=0 ) {
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