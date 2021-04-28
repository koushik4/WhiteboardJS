const jsdom = require("jsdom");
global.document = jsdom();
var canvas = global.document.getElementById('canvases');
var bodyMargin=8,wbBorder = 2, wbMargin = 2,optionMargin = 4;
var optionsWidth = global.document.getElementById("options").offsetWidth;
var headingHeight = global.document.getElementById("heading").offsetHeight;
var isPaintable = false,color = "black";
var draw = canvas.getContext("2d");
var arr = {}, count = 0;
var chk = false;
const socket = io();
const kou = function init() {
    isPaintable = false;
    color = "black";
    canvas.height = window.innerHeight-headingHeight-4*bodyMargin-(wbBorder+wbMargin)*2;
    canvas.width = window.innerWidth -optionsWidth-4*bodyMargin-(wbBorder+wbMargin)*2-optionMargin;
    chk = false;
    draw.lineWidth = 5;
    draw.lineCap = 'round';
}
//Enable Drawing
function KeepDrawing() {
    chk = true;
}

function get(obj) {
    console.log(obj);
    var circle =  global.document.getElementsByTagName("body");
    circle[0].style.cursor = "crosshair"; 
}

//Make the cursor to crosshair and enable drawing
function pencilCursor(obj) {
    global.document.getElementById("canvases").style.cursor = "crosshair";
    isPaintable = true;
}

//Download the image drawn
function saveImage(obj){
    let url = canvas.toDataURL("image/jpg");
    global.document.getElementById("save").href = url;
}

//Refresh the entire screen
function Refresh(obj){
    console.log("hfshdods");
    draw.fillStyle = "white";
    draw.fillRect(0,0,canvas.width,canvas.height);
}

//Change cursor to white rectangle and enable erasing
function eraserCursor(obj){
    console.log("nenlsd");
    global.document.getElementById("canvases").style.cursor = "url('images/New\ Piskel.png') ,default";
    isPaintable = false;
}

//Change the color of pencil
function changeColor(c){
    color = c;
    draw.strokeStyle=c;
}
//Disable Drawing
function stopDrawingOnCanvas() { 
    chk = false;
    draw.beginPath();
}
//Draw on the current point
function drawOnCanvas(obj) {
    //Pencil
    if (chk && isPaintable) {
        console.log(isPaintable);
        // draw.strokeStyle = color;
        let optionsX = global.document.getElementById("options").offsetWidth;
        let wbBorder = 2, wbMargin = 2,optionMargin = 4;
        let headingY = global.document.getElementById("heading").offsetHeight;
        let x = window.event.clientX-optionsWidth-4*bodyMargin-(wbBorder+wbMargin)*2-2;// relative position from
        let y = window.event.clientY-headingHeight-4*bodyMargin-(wbBorder+wbMargin)*2;// absolute positions
        arr[count] = [x,y];
        count+=1;
        draw.lineTo(x, y);
        draw.stroke();
    }
    //Eraser
    if(chk && !isPaintable){
        draw.fillStyle = "white";
        let x = window.event.clientX-optionsWidth-4*bodyMargin-(wbBorder+wbMargin)*2+10;// relative position from
        let y = window.event.clientY-headingHeight-4*bodyMargin-(wbBorder+wbMargin)*2+21;// absolute positions
        draw.fillRect(x,y,25,25);
        draw.strokeStyle = color;
    }
}

module.exports = kou;
