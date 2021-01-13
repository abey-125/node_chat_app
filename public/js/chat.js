const socket = io()

// socket.on('countUpdate',(count)=>{
//     console.log('the val of count is!: ',count)
// })
// let val=0
// document.querySelector('#increment').addEventListener('click',()=>{
    
// console.log('clicked')
// socket.emit('increment')
    
// })
//font
const $messageformselector=document.querySelector('#form1')
const $button = $messageformselector.querySelector('button')
const $input= $messageformselector.querySelector('input')
const $locationButton =document.querySelector('#get-location')
const $chatdiv = document.querySelector('#messages')
const $sidebar = document.querySelector('#sidebar')

//template
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate= document.querySelector('#location-template').innerHTML
const sidebarTemplaate = document.querySelector('#sidebar_template').innerHTML

const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoScroll=()=>{
    const $newMessage= $chatdiv.lastElementChild

    // height of new message
    const newMessageStyle = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyle.marginBottom)

    const newMessageheight= $newMessage.offsetHeight + newMessageMargin
    
    //visible height
    const visibleHeight = $chatdiv.offsetHeight

    // height of message container
    const containerHeight = $chatdiv.scrollHeight

    // how far i started 

    const scrolloffset= $chatdiv.scrollTop+visibleHeight

    if(containerHeight - newMessageheight <= scrolloffset){
        $chatdiv.scrollTop=$chatdiv.scrollHeight
    }
}

socket.on('msg',(msg)=>{
    const html= Mustache.render(messageTemplate,{
        username:msg.username,
        message:msg.text,
        createdAt:moment(msg.timestamp).format('hh:mm a')

    })
    $chatdiv.insertAdjacentHTML('beforeend',html)
    autoScroll()
    console.log(msg)
    
})
socket.on('roomData',({room,users})=>{
    const html= Mustache.render(sidebarTemplaate,{
        room:room,
        users:users,
        
    })
    $sidebar.innerHTML=html
   
})
$messageformselector.addEventListener('submit',(e)=>{
    e.preventDefault()
    $button.setAttribute('disabled','disabled')
    // let name= document.querySelector('#name').value
    // let msg= document.querySelector('#msg').value
    // socket.emit('message',name,msg)
    // console.log('submitted')
    // let msg= document.querySelector('input').value
    let msg= e.target.elements.message.value
    socket.emit('message',msg,(error)=>{
        $button.removeAttribute('disabled')
        $input.value=''
        $input.focus()
        if(error){
            return console.log(error)
        }
        console.log(val)
    })
})

$locationButton.addEventListener('click',()=>{
    $locationButton.setAttribute('disabled','disabled')
    if(!navigator.geolocation){
        return alert('Your browser doesnot support geolocation !!..')

    }
    navigator.geolocation.getCurrentPosition((position)=>{
        
        let lat= position.coords.latitude
        let long = position.coords.longitude
        socket.emit('position',lat,long,()=>{
            $locationButton.removeAttribute('disabled')
            console.log('location shared')
        })
    })
    
})

socket.on('location',(msg)=>{
    console.log(msg)
    const html = Mustache.render(locationTemplate,{
        username:msg.username,
        timestamp:moment(msg.timestamp).format('hh:mm a'),
        url:msg.url
    })
    $chatdiv.insertAdjacentHTML('beforeend',html)
    autoScroll()
})

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }


})