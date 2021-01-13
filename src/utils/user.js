const users=[]
const addUser=({id,username,room,})=>{
    //clean the data
    username= username.trim().toLowerCase()
    room = room.trim().toLowerCase()


    // validate the data 
    if(!username||!room){
        return{
            error:'userName and Room are required'
        }
    }


    // check for existing user

    const existingUser = users.find((user)=>{
        return user.username === username && user.room===room

    })

    // validate user name
    if(existingUser){
        return{
            error:'username is in use!'
        }

    }

    const user = {id,username,room}
    users.push(user)
    return {user}

}

const removeUser = (id)=>{
    const index =users.findIndex((user)=>{
       return user.id===id
    })
    if(index!== -1){
        
        return users.splice(index,1)[0]
    }
}

const getUser=(id)=>{
    const user1 = users.find((user)=>{
       return user.id ===id
    })
    return user1
    
}
const getUserInRoom = (room)=>{
    const UserInRoom= users.filter((user)=>{
        return user.room===room
    })
    return UserInRoom

}


module.exports={
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}