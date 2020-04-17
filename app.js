if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// hello
let players = {}
let connections = [null, null]
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
let idx = 0;


io.on('connection', socket => {  

    
    positions[0].left = 80
    positions[1].left = 80
    firstId = null
    secondId = null


    console.log(idx);
    
    if ( players.length >= 2 ){
         players = []
    }
    
    socket.on('players', player =>  {
        players.push(player)
        io.emit('playerName', players)
        console.log(idx);
        
        console.log(players);
        
        socket.emit('player-number', `You are now player ${players.length}`)
        socket.broadcast.emit('player-connect', `Player ${players[idx]} just connected`)
        idx += 1
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
                players = []
                idx = 0;
            } else {
                io.emit('positions', positions)
            }
            
        } else if(firstId && !secondId && firstId !== data.id) {
                 positions[1].left -= 5; // left -5
                if (positions[1].left <=0 ) {
                    io.emit('positions', positions)
                    io.emit('winner', data.name)
                    players = []
                    idx = 0;
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
                    players = []
                    idx = 0;
                } else {
                    io.emit('positions', positions)
                }
            } else if(secondId === data.id){
                positions[1].left -= 2; // left -5
                if (positions[1].left <=0 ) {
                    io.emit('positions', positions)
                    io.emit('winner', data.name)
                    players = []
                    idx = 0;
                } else {
                    io.emit('positions', positions)
                }
            }

    //End ON Events
    socket.on('disconnect', (payload) => {
        // positions[0].left = 90
        // positions[1].left = 90
        // firstId = null
        // secondId = null
        // UPGRADE
        connections = [null, null]
        coords = [null, null]
        playerIndex = -1
        players = {}

        io.emit('disconnected', payload)

    })

 

})

http.listen(PORT, () => {
    console.log(`listening on PORT: ${PORT}`);
})