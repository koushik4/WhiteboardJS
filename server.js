const express = require("express");
const socketio = require("socket.io");
const path = require("path");   
const http = require("http");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = 5000 || process.env.PORT;

//add static files
app.use(express.static(path.join(__dirname,"whiteboard"))); 

//When a client connects to this listen
io.on("connection", socket=> {
    socket.emit("check","check");

    //Broadcast the coordinate where to be drawn.
    socket.on("DrawingCoordinates", obj=>{
        socket.broadcast.emit("DrawingCoordinatesFromServer",obj);
    });
    //Broadcast the coordinate to be erased
    socket.on("EraseCoordinates",obj=>{
        socket.broadcast.emit("EraseCoordinatesFromServer",obj);
    })
    socket.on("RefreshTheScreen",msg=>{
        socket.broadcast.emit("RefreshTheScreenFromServer",msg);
    })
    socket.on("StopDrawing",()=>{
        socket.broadcast.emit("StopDrawingFromServer");
    })
});



//listen to 5000 port
server.listen(port,()=>{
    console.log("Listening to 5000");
});