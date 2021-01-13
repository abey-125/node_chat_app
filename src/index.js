const express =require('express')
const  path =require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage,generateLocation}= require('./utils/messages')
const { count } = require('console')
const {addUser,removeUser,getUser,getUserInRoom} = require('./utils/user')

const port =process.env.PORT||3000

const app = express()
const server = http.createServer(app)
const io=socketio(server)
const dirctName = path.join(__dirname,'../public')


app.use(express.static(dirctName))




io.on('connection',(socket)=>{
    console.log('new connection is established')
    // socket.emit('countUpdate',countval)

    // socket.on('increment',()=>{
    //     countval++
    //     io.emit('countUpdate',countval)
    // })
    
    socket.on('join',({username,room},callback)=>{
        const {error,user} = addUser({id:socket.id,username:username,room:room})
        if(error){
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('msg',generateMessage('admin','welcome'))
        socket.broadcast.to(user.room).emit('msg',generateMessage('admin',`${user.username} has joined the room`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUserInRoom(user.room)
        })
        callback()

    })

    socket.on('message',(msg,callback)=>{
        // console.log("message"+msg)
        const user = getUser(socket.id)
        const filter = new Filter()
        if(filter.isProfane(msg)){
            return callback(" profanity is not allowed")
        }
        io.to(user.room).emit('msg',generateMessage(user.username,msg))
        callback('delivered')
        
    })

    socket.on('position',(lat,long,callback)=>{
        const user = getUser(socket.id)
        // let postition ='Location :'+lat+' '+long
        let mapslink=`https://google.com/maps?q=${lat},${long}`
        callback()
        io.to(user.room).emit('location',generateLocation(user.username,mapslink))
    })
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('msg',generateMessage('admin',` ${user.username} has disconnected`))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUserInRoom(user.room)
            })
        }
        
    })

})

server.listen(port,()=>{
    console.log(`the post is up an running on ${port}!`)
})