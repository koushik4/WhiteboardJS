var socket = io();
var bodyMargin = 8, wbBorder = 2, wbMargin = 2, optionMargin = 4;
var isPaintable = false;
var draw = 'canvas.getContext("2d")';
var canvas = window.document.getElementById('canvases')
var firstTime = true;
var color = "black";
var optionsWidth = window.document.getElementById("options").offsetWidth;
var headingHeight = window.document.getElementById("heading").offsetHeight;
canvas.height = window.innerHeight - headingHeight - 4 * bodyMargin - (wbBorder + wbMargin) * 2;
canvas.width = window.innerWidth - optionsWidth - 4 * bodyMargin - (wbBorder + wbMargin) * 2 - optionMargin;
draw = canvas.getContext("2d");
chk = false;
draw.lineWidth = 5;
draw.lineCap = 'round';

/*****   CATCH THE EVENTS HERE   *****/

// If the user comes for the first time draw the canvas
socket.on("DrawExistingFromServer",(drawPos,erasePos)=>{
    if(firstTime){
        for(let i=0;i<drawPos.length;i++){
            draw.strokeStyle = drawPos[i]['color'];
            draw.lineTo(drawPos[i]['x'],drawPos[i]['y']);
            draw.stroke();
        }
        for(let i=0;i<erasePos.length;i++){
            draw.fillStyle = "white";
            draw.fillRect(erasePos[i]['x'],erasePos[i]['y'], 25, 25);
        }
        draw.beginPath();
    }
    firstTime = false;
});
// Draw the point on the canvas
socket.on("DrawingCoordinatesFromServer",obj=>{
    console.log(obj);
    draw.strokeStyle = obj['color'];
    draw.lineTo(obj['x'],obj['y']);
    draw.stroke();
    draw.strokeStyle = color;
});
// Erase the point on the canvas
socket.on("EraseCoordinatesFromServer",obj=>{
    console.log(obj);
    draw.fillStyle = "white";
    draw.fillRect(obj['x'],obj['y'], 25, 25);
});
// Refresh the entire canvas
socket.on("RefreshTheScreenFromServer",msg=>{
    console.log("hfshdods");
    draw.fillStyle = "white";
    draw.fillRect(0, 0, canvas.width, canvas.height);
});
//Disable drawing
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
    socket.emit("RefreshTheScreen","");
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
    socket.emit("StopDrawing");
}
//Draw on the current point
function drawOnCanvas(obj) {
    //Pencil
    if (chk && isPaintable) {
        draw.strokeStyle = color;
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
            'color':color
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
        const jsonObject1 = {
            'x':x,
            'y':y,
        };
        //Whenever the user is drawing, send the current position where the event is happening
        socket.emit("EraseCoordinates",jsonObject1);

    }
}
/* */
