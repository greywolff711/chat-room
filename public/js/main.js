const socket=io();
const chatForm=document.getElementById('chat-form');
const chatMessages=document.querySelector('.chat-messages');
const roomName=document.getElementById('room-name');
const userList=document.getElementById('users');
//get usernmae and room from url
const {username,room} =Qs.parse(location.search,{
    ignoreQueryPrefix:true
})
//join room
socket.emit('joinRoom',{username,room});
//get room and users
socket.on('roomUsers',function({room,users}){
    outputRoomName(room);
    outputUsers(users);
})
//message from server
socket.on('message',function(message){
    console.log(message);
    outputMessage(message);
    //Scroll down
    chatMessages.scrollTop=chatMessages.scrollHeight;
})
//message submit
chatForm.addEventListener('submit',function(e){
    e.preventDefault();
    const msg=e.target.elements.msg.value;
    //Emit a message to server 
    socket.emit('chatMessage',msg);
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
})
//Output message to DOM
function outputMessage(message){
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector(".chat-messages").appendChild(div);
}
//Add roomname to DOM
function outputRoomName(room){
    roomName.innerText=room;
}
//Add users to DOM
function outputUsers(users){
    userList.innerHTML=
    `${users.map(user=>`<li>${user.username}</li>`).join('')}`;
}