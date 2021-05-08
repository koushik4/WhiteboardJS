const express = require("express");
const socketio = require("socket.io");
const path = require("path");
const http = require("http");
const app = express();
const db = require("./database");
const url = require("url");
var bodyParser = require('body-parser')


app.use( bodyParser.json());      
app.use(bodyParser.urlencoded({     
  extended: true
})); 

//For server connection
const server = http.createServer(app);
const io = socketio(server);
const port = 5000 || process.env.PORT;

//For whiteboard canvas
var drawPositions = {};
var erasePositions = {};
var users = {};
var roomId = 0;

//add static files
app.use(express.static(path.join(__dirname, "whiteboard")));
app.use("/:roomId/:userId", express.static(path.join(__dirname, "whiteboard")))


//When user clocks signUp
app.get("/signup",(req,res)=>{
    res.sendFile(path.join(__dirname, "whiteboard", "signup.html"))
});

//When users enters 
app.post("/signup",(req,res)=>{
    let credentials = req.body
    let uid = Math.floor(Math.random() * (10000000 - 1000000) + 1000000)
    db.client.query(db.insert,[uid,credentials.username,credentials.password,credentials.email,credentials.firstName,credentials.lastName],
        (err,res)=>{
            if(!err)
            res.sendFile(path.join(__dirname, "whiteboard", "login.html"));
            else{
                res.sendFile(path.join(__dirname, "whiteboard", "signup.html"))
            }
        });

})
//When user clicks join button or just enters the webpage
app.get("/:userId", (req, res) => {
    if (req.query.roomId == undefined) {
        res.sendFile(path.join(__dirname, "whiteboard", "main.html"))
    }
    else {
        let uid = req.params.userId;
        res.redirect("/" + uid + "/" + req.query.roomId);
    }
});

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"whiteboard","login.html"));
})

app.post("/",(req,res)=>{
    var uname = req.body['username'];
    var upass = req.body['password'];
    db.client.query(db.select,[uname,upass]).then(r=>{
        if(r.rows===undefined){
        res.sendFile(path.join(__dirname,"whiteboard","login.html"));
        }
        else{
         res.redirect("/"+r.rows[0].uId);
        }
    });
})

//when user clicks create button
app.post("/:userId", (req, res) => {
    let uid = req.params.userId;
    res.redirect("/" + uid + "/" + roomId);
    roomId++;
});

//the whiteboard canvas
app.get("/:userId/:roomId", (req, res) => {
    res.sendFile(path.join(__dirname, "whiteboard", "whiteboard.html"))
});


//When a client connects to this listen
io.on("connection", socket => {
    //Broadcast the coordinate where to be drawn.
    socket.on("DrawingCoordinates", obj => {
        drawPositions["" + obj.roomId].push(obj);
        socket.to(obj.roomId).emit("DrawingCoordinatesFromServer", obj);
    });

    //Whenever user enters the whiteboard
    socket.on("AssignRoom", () => {
        var roomId = url.parse(socket.handshake.headers.referer).pathname.substring(1);
        var userId = roomId.substring(0, roomId.indexOf("/"))
        var roomId = roomId.substring(roomId.indexOf("/") + 1, roomId.length - 1)
        console.log(roomId);
        if (drawPositions[roomId] === undefined) {
            drawPositions[roomId] = [];
            erasePositions[roomId] = [];
        }
        if(users[roomId]==undefined)users[roomId] = [];
        users[roomId].push(userId);
        socket.join("" + roomId);
        socket.emit("AssignRoomId", "" + roomId);
        socket.emit("DrawExistingCanvas", drawPositions[roomId], erasePositions[roomId])

    });

    //Broadcast the coordinate to be erased
    socket.on("EraseCoordinates", obj => {
        erasePositions[obj.roomId].push(obj);
        socket.to(obj.roomId).emit("EraseCoordinatesFromServer", obj);
    });

    //When host clicks refresh button
    socket.on("RefreshTheScreen", rId => {
        socket.broadcast.emit("RefreshTheScreenFromServer", rId);
        erasePositions[rId] = []; drawPositions[rId] = [];
    });

    //When users stops drawing
    socket.on("StopDrawing", (roomId) => {
        drawPositions[roomId].push(-1);
        socket.broadcast.emit("StopDrawingFromServer");
    });

    //when user disconnects(quits)
    socket.on("disconnect", () => {
        var roomId = url.parse(socket.handshake.headers.referer).pathname.substring(1);
        var userId = roomId.substring(0, roomId.indexOf("/"))
        var roomId = roomId.substring(roomId.indexOf("/") + 1, roomId.length - 1)
        if (userId != "" && roomId != "") {
            console.log(users);
            users[roomId].splice(users[roomId].indexOf(userId));
            if (users[roomId].length == 0) delete users[roomId];
        }
    });
});



//listen to 5000 port
server.listen(port, () => {
    console.log("Listening to 5000");
});