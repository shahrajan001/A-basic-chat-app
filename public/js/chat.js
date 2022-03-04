const socket = io()

// socket.on('countUpdated',(count)=>{
//     console.log("The count has been updated",count)
// })

// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log('CLicked')
//     socket.emit('increment')

// })

socket.on('message',(message)=>{
    console.log(message)
})

document.querySelector('#message-form').addEventListener('submit',(e)=>{
    e.preventDefault()
    // const message = document.querySelector('message').value 
    let message = e.target.elements.message.value

    socket.emit('sendMessage',message,(error)=>{
        if(error){
            console.log(error)
        }
        console.log('Message delivered')
               // console.log('The message has been',mess)
    })
})

document.querySelector('#send_location').addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Your browser does not support Geolocation services')
    }
    navigator.geolocation.getCurrentPosition((position)=>{
        // socket.on('sendLocation',(position)=>{
            socket.emit('sendLocation',{   
                latitude:position.coords.latitude,
                longitude:position.coords.longitude
            },()=>{
            console.log("Location shared")
            })

        }) 
    })