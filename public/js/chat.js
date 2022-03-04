const socket = io()

// socket.on('countUpdated',(count)=>{
//     console.log("The count has been updated",count)
// })

// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log('CLicked')
//     socket.emit('increment')
// })

//elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = document.querySelector('button')
const $sendLocationButton = document.querySelector('#send_location')
const $messages = document.querySelector('#messages')

//templates
const messageTemplate = document.querySelector('#message_template').innerHTML
const locationTemplate = document.querySelector('#location_template').innerHTML

socket.on('message',(message)=>{
    console.log(message)

    const html = Mustache.render(messageTemplate,{message:message})  //errorrrrrr
    $messages.insertAdjacentHTML('beforeend',html)

})

socket.on('locationMessage',(url)=>{
    console.log(url)

    const html = Mustache.render(locationTemplate,{url:url})  //errorrrrrr
    $messages.insertAdjacentHTML('beforeend',html)

})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    // disable
    // const message = document.querySelector('message').value 
    let message = e.target.elements.message.value

    socket.emit('sendMessage',message,(error)=>{
    //enable
        if(error){
            console.log(error)
        }
        console.log('Message delivered')
               // console.log('The message has been',mess)
    })
})

$sendLocationButton.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Your browser does not support Geolocation services')
    }
    $sendLocationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        // socket.on('sendLocation',(position)=>{
            socket.emit('sendLocation',{   
                latitude:position.coords.latitude,
                longitude:position.coords.longitude
            },()=>{
    $sendLocationButton.removeAttribute('disabled')
            console.log("Location shared")
            })
        }) 
    })