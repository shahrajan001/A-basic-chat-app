const socket = io()

//elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = document.querySelector('button')
const $sendLocationButton = document.querySelector('#send_location')
const $messages = document.querySelector('#messages')
const $sidebar = document.querySelector('#sidebar')

//templates
const messageTemplate = document.querySelector('#message_template').innerHTML
const locationTemplate = document.querySelector('#location_template').innerHTML

const sidebarTemplate = document.querySelector('#sidebar_template').innerHTML

//options
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message',(message)=>{
    console.log(message)

    const html = Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,   
        createdAt: moment(message.createdAt).format("kk:mm:ss")
    })   
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()

})

socket.on('locationMessage',(url)=>{
    
    const html = Mustache.render(locationTemplate,{
        username:url.username,
        url:url.url,
        createdAt: moment(url.createdAt).format("kk:mm:ss")
    })  

    $messages.insertAdjacentHTML('beforeend',html)

})

socket.on('roomData', ({room,users}) => {               
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })  
    $sidebar.innerHTML = html 
    
})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    // disable
    $messageFormButton.setAttribute('disabled', 'disabled')
    // const message = document.querySelector('message').value 
    let message = e.target.elements.message.value

    socket.emit('sendMessage',message,(error)=>{
    //enable
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value = ''
    $messageFormInput.focus()
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

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href ='/'
    }
})

// socket.on('countUpdated',(count)=>{
//     console.log("The count has been updated",count)
// })

// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log('CLicked')
//     socket.emit('increment')
// })
