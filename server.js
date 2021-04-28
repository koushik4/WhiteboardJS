const express = require("express");
const socketio = require("socket.io");
const path = require("path");   
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = 5000 || process.env.PORT;
let drawingPositions = [];
let count = 0;
let erasedPosition = [];
//add static files
app.use(express.static(path.join(__dirname,"whiteboard"))); 

//When a client connects to this listen
io.on("connection", socket=> {
    count++;
    const url = socket.handshake.headers.referer;
    if(url === "http://localhost:5000/whiteboard.html?"){
        socket.emit("DrawExistingFromServer",drawingPositions,erasedPosition);
    }
    //Broadcast the coordinate where to be drawn.
    socket.on("DrawingCoordinates", obj=>{
        drawingPositions.push(obj);
        socket.broadcast.emit("DrawingCoordinatesFromServer",obj);
    });
    //Broadcast the coordinate to be erased
    socket.on("EraseCoordinates",obj=>{
        erasedPosition.push(obj);
        console.log(obj);
        socket.broadcast.emit("EraseCoordinatesFromServer",obj);
    });
    //Broadcast a message to refresh
    socket.on("RefreshTheScreen",msg=>{
        socket.broadcast.emit("RefreshTheScreenFromServer",msg);
        drawingPositions = [];erasedPosition = [];
    });
    //Broadcast a message to stop drawing
    socket.on("StopDrawing",()=>{
        socket.broadcast.emit("StopDrawingFromServer");
    });
    //If the user exits
    socket.on("disconnect",socket=>{
        count--;
        if(count === 0){drawingPositions = [];erasedPosition = [];}
    });
});



//listen to 5000 port
server.listen(port,()=>{
    console.log("Listening to 5000");
});