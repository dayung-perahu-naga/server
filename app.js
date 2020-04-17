if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

let players = {}
let connections = [null, null]
const express = require ('express') ;
const app = express() ;
const http = require('http').createServer(app) ;
const io = require('socket.io')(http) ;
const PORT = process.env.PORT || 4100;
let coords = [null, null]
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

// let firstId;
// let secondId;

io.on('connection', socket => {

    // console.log("MY SOCKET ID IS");
    // console.log(socket.id);
    
    // FIND PLAYER NUMBER
    let playerIndex = -1

    for(let i = 0; i < connections.length; i++) {
        if(connections[i] === null && coords[i] === null) {
            playerIndex = i
        }
    }

    // TELL PLAYER WHAT PLAYER# YOU ARE
    socket.emit('player-number', `You are now player ${playerIndex+1}`)


    // IGNORE PLAYER 3
    if(playerIndex === -1) {
        return
    }

    connections[playerIndex] = socket
    // console.log("CONNECTION IS NOW");
    // console.log(connections);

    
    // CANONICAL 2048
    coords[playerIndex] = positions[playerIndex]

    let sid = connections[playerIndex]['id']
    // console.log("THIS IS MY SOCKET ID");
    // console.log(sid);

    players[sid] = coords[playerIndex] 
        
        // // LOOP TO ASSIGN ID BASED ON SOCKET ID
        // for(let i = 0; i < connections.length;  i++) {
        //     console.log("the socket id is");
        //     console.log(connections[i]);
        //     players[connections[i].id] = coords[i]
        // }

    


    // TELL EVERYONE YOU HAVE CONNECTED
    io.emit('player-connect', `Player ${playerIndex+1} just connected`)


    
    socket.emit('positions', positions);
    socket.on('move', data => {
        
        // if(positions[0].left <= 0 || positions[1].left <= 0) {
        //     io.emit('winner', data.name)
        //     positions[0].left = 90
        //     positions[1].left = 90
        //     firstId = null
        //     secondId = null
        // } else {

        //     // WHERE TURNS PLAY IN
        //     if(!firstId && !secondId) {
        //         firstId = data.id
        //         positions[0].left -= 5
        //     } 
        //     else if(firstId && !secondId && firstId !== data.id) {
        //         secondId = data.id
        //         positions[1].left -= 5; // left -5
        //     } 
        //     else if (firstId === data.id) {
        //         positions[0].left -= 5;
        //     }
        //     else if(secondId === data.id){
        //         positions[1].left -= 5;
        //     }

        // }


        // UPDATE PLAN
        
        if(players[data.id]) {

            if(players[data.id].left <= 0) {
                io.emit('winner', data.name)

                // RESET EVERYTHING
                for(let key in players) {
                    players[key].left = 90
                }
                connections = [null, null]
                coords = [null, null]
                playerIndex = -1
                players = {}
            } else {
                players[data.id]['left'] -= 5
            }

        }
       
        // WE ALWAYS EMIT POSITIONS, NO MATTER WHAT
        // io.emit('positions', positions)

        
        // UPGRADE
        var pos = []
        for(key in players) {
            pos.push(players[key])
        } 

        console.log("CHECKLIST, THIS IS POSITIONS UPDATED");
        console.log(pos);
        
        io.emit('positions', pos)
        pos = []

    })

    //End ON Events
    socket.on('disconnect', () => {
        // positions[0].left = 90
        // positions[1].left = 90
        // firstId = null
        // secondId = null
        // UPGRADE
        connections = [null, null]
        coords = [null, null]
        playerIndex = -1
        players = {}
    })

})

http.listen(PORT, () => {
    console.log(`listening on PORT: ${PORT}`);
})