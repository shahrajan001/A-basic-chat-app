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

// let count = 0
io.on('connection',(socket)=>{
    console.log("Websocket connection established   ")

    socket.emit('message','Welcome to app!!!!')                //message sent to all users
    socket.broadcast.emit('message','A new user has joined.')  //message sent to all existing users
    socket.on('sendMessage',(message)=>{    
        io.emit('message',message)
        })

    socket.on('disconnect', () => {                           //message sent to all users
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









