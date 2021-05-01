var socket = io();
var bodyMargin = 8, wbBorder = 2, wbMargin = 2, optionMargin = 4;
var isPaintable = false, color = "black";
var draw = 'canvas.getContext("2d")';
var canvas = window.document.getElementById('canvases')
color = "black";
var optionsWidth = window.document.getElementById("options").offsetWidth;
var headingHeight = window.document.getElementById("heading").offsetHeight;
canvas.height = window.innerHeight - headingHeight - 4 * bodyMargin - (wbBorder + wbMargin) * 2;
canvas.width = window.innerWidth - optionsWidth - 4 * bodyMargin - (wbBorder + wbMargin) * 2 - optionMargin;
draw = canvas.getContext("2d");
var roomId  = -1;
chk = false;
var a = true;
draw.lineWidth = 5;
draw.lineCap = 'round';

/*****   CATCH THE EVENTS HERE   *****/
socket.emit("AssignRoom");
socket.on("kou",rId=>{
    console.log("kou",rId);
    roomId = rId;
})
socket.on("DrawExistingCanvas",(obj1,obj2)=>{
    if(a){
        console.log(obj1    );
        var i;
        for(i=0;i<obj1.length;i++){
            if(obj1[i]==-1){
                draw.beginPath();
                continue;
            }
            console.log("hello");
            draw.strokeStyle = obj1[i]['color'];
            draw.lineTo(obj1[i]['x'],obj1[i]['y']);
            draw.stroke();
        }
        for(i=0;i<obj2.length;i++){ 
            draw.fillStyle = "white";
            draw.fillRect(obj2[i]['x'],obj2[i]['y'], 25, 25);
        }
        draw.beginPath();
    }
    a = !a
});
socket.on("DrawingCoordinatesFromServer",obj=>{
    draw.strokeStyle = obj['color'];
    draw.lineTo(obj['x'],obj['y']);
    draw.stroke();
    draw.strokeStyle = color;
});

socket.on("EraseCoordinatesFromServer",obj=>{
    draw.fillStyle = "white";
    draw.fillRect(obj['x'],obj['y'], 25, 25);
});

socket.on("RefreshTheScreenFromServer",msg=>{
    draw.fillStyle = "white";
    draw.fillRect(0, 0, canvas.width, canvas.height);
});

socket.on("StopDrawingFromServer",()=>{
    draw.beginPath();
});
/* */


/*****   FOR COMMUNICATING WITH FRONT END   *****/
//Enable Drawing
function KeepDrawing() {
    chk = true;
}

//Make the cursor to crosshair and enable drawing
function pencilCursor(obj) {
    window.document.getElementById("canvases").style.cursor = "crosshair";
    isPaintable = true;
}

//Download the image drawn
function saveImage(obj) {
    let url = canvas.toDataURL("image/jpg");
    window.document.getElementById("save").href = url;
}

//Refresh the entire screen
function Refresh(obj) {
    console.log("hfshdods");
    draw.fillStyle = "white";
    draw.fillRect(0, 0, canvas.width, canvas.height);

    //Send a signal to refresh the entire screen
    socket.emit("RefreshTheScreen",roomId);
}

//Change cursor to white rectangle and enable erasing
function eraserCursor(obj) {
    window.document.getElementById("canvases").style.cursor = "url('images/New\ Piskel.png') ,default";
    isPaintable = false;
}

//Change the color of pencil
function changeColor(col) {
    color = col;
    draw.strokeStyle = col;
}
//Disable Drawing
function stopDrawingOnCanvas() {
    chk = false;
    draw.beginPath();
    //Send a signal to stop drawing
    socket.emit("StopDrawing",roomId);
}
//Draw on the current point
function drawOnCanvas(obj) {
    //Pencil
    if (chk && isPaintable) {
        // draw.strokeStyle = color;
        let optionsX = window.document.getElementById("options").offsetWidth;
        let wbBorder = 2, wbMargin = 2, optionMargin = 4;
        let headingY = window.document.getElementById("heading").offsetHeight;
        let x = window.event.clientX - optionsWidth - 4 * bodyMargin - (wbBorder + wbMargin) * 2 - 2;// relative position from
        let y = window.event.clientY - headingHeight - 4 * bodyMargin - (wbBorder + wbMargin) * 2;// absolute positions
        draw.lineTo(x, y);
        draw.stroke();
        //Send a JSON object which has current position and colour
        const jsonObject = {
            'x':x,
            'y':y,
            'color':color,
            "roomId":roomId
        }
        //Whenever the user is drawing, send the current position where the event is happening
        socket.emit("DrawingCoordinates",jsonObject);
    }
    //Eraser
    if (chk && !isPaintable) {
        draw.fillStyle = "white";
        let x = window.event.clientX - optionsWidth - 4 * bodyMargin - (wbBorder + wbMargin) * 2 + 10;// relative position from
        let y = window.event.clientY - headingHeight - 4 * bodyMargin - (wbBorder + wbMargin) * 2 + 21;// absolute positions
        draw.fillRect(x, y, 25, 25);
        const jsonObject = {
            'x':x,
            'y':y,
            "roomId":roomId
        }
        //Whenever the user is drawing, send the current position where the event is happening
        socket.emit("EraseCoordinates",jsonObject);

    }
}
/* */
