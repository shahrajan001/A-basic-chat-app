const express = require("express");
const path = require('path')
const {generateMessage,generateLocationMessage} = require ('./service/messages')

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

    socket.on('join',({username,room})=>{   
        socket.join(room)
        
    socket.emit('message',generateMessage('Room connected'))                 //message sent to user joined
    socket.broadcast.to(room).emit('message',generateMessage(`${username} has joined.`))                 //message sent to all existing users
    
    }) 
    socket.on('sendMessage',(message,callback)=>{    
    const filter = new Filter()  
       
    if(filter.isProfane(message)){
        return callback("Profanity not allowed")
    }
        io.emit('message',generateMessage(message))
        callback()
    })

    socket.on('sendLocation',(location,callback)=>{    
        io.emit('locationMessage',generateLocationMessage(`https://www.google.com/maps/?q=${location.latitude},${location.longitude}`))
        callback()
        // console.log(location)
    })

    socket.on('disconnect', () => {                           //message sent to all users
        io.emit('message', generateMessage('A user has left!'))               
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

//socket.emit                   send event to a specific client
//io.emit                       send event to all clients
//socket.broadcast.emit         send event to all clients except that client

//io.to.emit                    it emits an event to everybody in a specific room.
//socket.broadcast.to.emit      sending an event to everyone except for the specific client, but it's limiting it to a specific chat room.








