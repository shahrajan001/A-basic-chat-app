const generateMessage = (text) =>{
    return {
        text,
        createdAt: new Date().getTime()
    }
}


const generateSendMessage = (username,text) =>{
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}
const generateLocationMessage = (username,url) =>{
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}
module.exports = {
    generateMessage,
    generateSendMessage,
    generateLocationMessage
}