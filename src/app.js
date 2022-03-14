const express = require("express");
const path = require('path')
const {generateMessage,generateSendMessage,generateLocationMessage} = require ('./service/messages')
const {addUser,removeUser,getUser,getUsersInRoom } = require ('./service/users')

const app = express();
const port = process.env.PORT || 3000;
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
    
    socket.on('join',(options,callback)=>{   
        const {user,error} = addUser({id:socket.id,...options})
        if(error){
            return callback(error)
        }   
        socket.join(user.room)
        
    socket.emit('message',generateMessage('Room connected'))                                         //message sent to user joined
    socket.broadcast.to(user.room).emit('message',generateMessage(`${user.username} has joined.`))   //message sent to all existing users
    io.to(user.room).emit('roomData',{
            room:user.room,
            users: getUsersInRoom(user.room)

    })  
        callback()
    }) 

    socket.on('sendMessage',(message,callback)=>{    
    const filter = new Filter()  
    const user= getUser(socket.id)
    
    
    if(filter.isProfane(message)){
        return callback("Profanity not allowed")
    }
        io.to(user.room).emit('message',generateSendMessage(user.username,message))
        callback()
    })

    socket.on('sendLocation',(location,callback)=>{    
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://www.google.com/maps/?q=${location.latitude},${location.longitude}`))
        callback()  
    })

    socket.on('disconnect', () => {                           //message sent to all users
        const user = removeUser(socket.id)
        if(user){
        io.to(user.room).emit('message', generateMessage(`${user.username} has left!!`))               
        io.to(user.room).emit('roomData',{
            room:user.room,
            users: getUsersInRoom(user.room)
    })  
        }
    })
})
server.listen(port, () => {
    console.log("Server is up on port " + port);
})
    
    //server(emit) -> client(receive) :- countUpdated
    //client(emit) -> server(receive) :- increment

//     socket.emit('countUpdated',count)
//     socket.on('increment',()=>{
//         count ++
//         // socket.emit('countUpdated',count)       //admits to only that single connection
//         io.emit('countUpdated',count)       //admits to all the connections
//     })



//socket.emit                   send event to a specific client
//io.emit                       send event to all clients
//socket.broadcast.emit         send event to all clients except that client

//io.to.emit                    it emits an event to everybody in a specific room.
//socket.broadcast.to.emit      sending an event to everyone except for the specific client, but it's limiting it to a specific chat room.








