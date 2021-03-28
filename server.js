const path=require('path');
const http=require('http');
const express=require('express');
const socketio=require('socket.io');
const formatMessage=require('./utils/messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers}=require('./utils/users');
const app=express();
const server=http.createServer(app);
const io=socketio(server);
//set statc folder
app.use(express.static(path.join(__dirname,'public')));
const botname='chatcord';
//run when client connects
io.on('connection',function(socket){
    socket.on('joinRoom',function({username,room}){
        console.log(room);
        const user=userJoin(socket.id,username,room);
        socket.join(user.room);
        socket.emit('message',formatMessage(botname,'Welcome to ChatCord'));
        socket.broadcast.to(user.room).emit('message',formatMessage(botname,`${user.username} has joined`));
        //send user and room info
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })
    //runs when client disconnect
    socket.on('disconnect',function(){
        const user=userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message',formatMessage(botname,`${user.username} has left the chat`));
            //send user and room info
            io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
            })
        }
    })
    //listen for chat message
    socket.on('chatMessage',function(msg){
        var user=getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(`${user.username}`,msg));
    })
})
const PORT=3000||process.env.PORT;
server.listen(PORT,function(){
    console.log(`online ${PORT}`);
})