const express = require("express");
const socketio = require("socket.io");
const path = require("path");   
const http = require("http");
const app = express();
const url = require("url");
const uuid = require("uuid");
const { connect } = require("http2");
const server = http.createServer(app);
const io = socketio(server);
const port = 5000 || process.env.PORT;
var drawPositions = {};
var erasePositions = {};
var roomId = 0;

//add static files
app.use(express.static(path.join(__dirname,"whiteboard"))); 


app.get("/",(req,res)=>{
    if(req.query.roomId==undefined){
    res.sendFile(path.join(__dirname,"whiteboard","main.html"))
    }
    else {
        res.redirect("/"+req.query.roomId);
    }
});

//When a client connects to this listen
io.on("connection", socket=> { 

    
    app.post("/",(req,res)=>{
        res.redirect("/"+roomId);
        roomId++;
    });
    app.get("/:roomId",(req,res)=>{
        var rid = req.params.roomId;
        res.sendFile(path.join(__dirname,"whiteboard","whiteboard.html"))
    })
    //Broadcast the coordinate where to be drawn.
    socket.on("DrawingCoordinates", obj=>{
        drawPositions[""+obj.roomId].push(obj);
        socket.to(obj.roomId).emit("DrawingCoordinatesFromServer",obj);
    });

    socket.on("AssignRoom",()=>{
        var roomId = url.parse(socket.handshake.headers.referer).pathname.substring(1);
        if(drawPositions[roomId]===undefined){
        drawPositions[roomId] = [];
        erasePositions[roomId] = [];
        }
        socket.join(""+roomId);
        socket.emit("kou",""+roomId);
        socket.emit("DrawExistingCanvas",drawPositions[roomId],erasePositions[roomId])

    });
    //Broadcast the coordinate to be erased
    socket.on("EraseCoordinates",obj=>{
        erasePositions[obj.roomId].push(obj);
        socket.to(obj.roomId).emit("EraseCoordinatesFromServer",obj);
    })
    socket.on("RefreshTheScreen",rId=>{
        socket.broadcast.emit("RefreshTheScreenFromServer",rId);
        erasePositions[rId] = [];drawPositions[rId] = [];
    })
    socket.on("StopDrawing",(roomId)=>{
        drawPositions[roomId].push(-1);
        socket.broadcast.emit("StopDrawingFromServer");
    });
});



//listen to 5000 port
server.listen(port,()=>{
    console.log("Listening to 5000");
});