let createButton = document.getElementById("create");
const socket = io();
document.getElementById("create").addEventListener("click", function(event){
    // event.preventDefault()
    socket.emit("DrawExisting");
});
socket.on("New Position", arr=>{
    s.draw.lineTo(x, y);
    s.draw.stroke();
});
socket.on("check",msg=>{console.log(msg);})