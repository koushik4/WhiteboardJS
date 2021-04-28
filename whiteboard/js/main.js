const s = require("./app");
let createButton = document.getElementById("koushik");
const socket = io();

socket.on("New Position", arr=>{
    s.draw.lineTo(x, y);
    s.draw.stroke();
});
socket.on("check",msg=>{console.log(msg);})