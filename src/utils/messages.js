const generateMessage= (username,msg)=>{
    return {
        username:username,
        text:msg,
        timestamp:new Date().getTime()
    }

}

const generateLocation =(username,url)=>{
    return{
        username:username,
        url:url,
        timestamp:new Date().getTime
    }
}

module.exports={
    generateMessage,
    generateLocation 
}