let createButton = document.getElementById("koushik");
const socket = io();
socket.on("check",msg=>{console.log(msg);})
createButton.addEventListener('submit',e =>{
    console.log("hello");
    socket.emit("fuk","fuck");
});