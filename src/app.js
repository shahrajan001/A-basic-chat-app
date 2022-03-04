const express = require("express");
const path = require('path')
require("./db/mongoose");

const app = express();
const port = process.env.PORT;
const publicDirectoryPath = path.join(__dirname,'../public')

const http = require('http')                    //support for socket.io  //since you can't use express & socket.io together
const server = http.createServer(app)
const socketio = require('socket.io')
const io = socketio(server)

app.use(express.json());
app.use(express.static(publicDirectoryPath))

const Filter = require('bad-words')

//server(emit) -> client(receive) --acknowledgement --> server
//client(emit) -> server(receive) --acknowledgement --> client



// let count = 0
io.on('connection',(socket)=>{
    console.log("Websocket connection established   ")

    socket.emit('message','Welcome to app!!!!')                //message sent to all users
    socket.broadcast.emit('message','A new user has joined.')  //message sent to all existing users
    socket.on('sendMessage',(message,callback)=>{    
    const filter = new Filter()  
       
    if(filter.isProfane(message)){
        return callback("Profanity not allowed")
    }
        io.emit('message',message)
        callback('Delivered')
    })

    socket.on('sendLocation',(location,callback)=>{    
        io.emit('message',`https://www.google.com/maps/?q=${location.latitude},${location.longitude}`)
        callback()
        // console.log(location)
    })

    socket.on('disconnect', () => {                           //messax  ge sent to all users
        io.emit('message', 'A user has left!')
    })
    
    
    //server(emit) -> client(receive) :- countUpdated
    //client(emit) -> server(receive) :- increment

//     socket.emit('countUpdated',count)
//     socket.on('increment',()=>{
//         count ++
//         // socket.emit('countUpdated',count)       //admits to only that single connection
//         io.emit('countUpdated',count)       //admits to all the connections
//     })
})
server.listen(port, () => {
    console.log("Server is up on port " + port);
})









