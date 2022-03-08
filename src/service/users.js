const users = []

const addUser = ({id,username,room})=>{
    //clean data
    username = username.trim().toLowerCase()
    room = room.trim()

    //validate
    if(!username || !room){
        return {
            error:'Username & room are required'
        }
    }

    //check for existing method
    const existingUser = users.find((user) =>{
        return user.room === room && user.username === username
    })

    //validate username
    if(existingUser){
        return {
            error:'Username already exixts'
        }
    }else{
    //store user
    const user = {id,username,room}
    users.push(user)
    return {user}}
}


const removeUser = (id)=>{
    const index = users.findIndex((user)=>{
        return user.id == id
    })    

    if (index !== -1){
        return users.splice(index,1)[0]
    }
}

const getUser = (id)=>{ 
    const index = users.findIndex((user)=>{
        return user.id == id
    })
    if(index === -1){
        return {
            error:"user not found"
        }
    }else{
        const user = users[index] 
        return user
    }
}

const getUsersInRoom = (room)=>{
    const user = users.filter((user)=>{
        return user.room == room
    })

    if(!user){
        return {
            error:"No users found"
        }
    }else return user
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
// addUser({
//     id:001,
//     username:"RAJAN",
//     room:'001' 
// })

// addUser({
//     id:007,
//     username:"RAJ",
//     room:'002' 
// })
// addUser({
//     id:002,
//     username:"RAJA",
//     room:'002' 
// })

// addUser({
//     id:002,
//     username:"RAJA shah",
//     room:'002' 
// })
// console.log(users)
// console.log(getUser(001))
// console.log('Users in room',getUsersInRoom(001))

// console.log('Before removing',users)
// removeUser(001)
// console.log('After removing',users)

