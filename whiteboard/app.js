var canvas = document.getElementById('canvases');
let bodyMargin=8,wbBorder = 2, wbMargin = 2,optionMargin = 4;
let optionsWidth = document.getElementById("options").offsetWidth;
let headingHeight = document.getElementById("heading").offsetHeight;
var isPaintable = false,color = "black";

canvas.height = window.innerHeight-headingHeight-4*bodyMargin-(wbBorder+wbMargin)*2;
canvas.width = window.innerWidth -optionsWidth-4*bodyMargin-(wbBorder+wbMargin)*2-optionMargin;
console.log(document.getElementById("options").offsetWidth);
var draw = canvas.getContext("2d");
var chk = false;
function check() {
    chk = true;
}
function get(obj) {
    console.log(obj);
    var circle =  document.getElementsByTagName("body");
    circle[0].style.cursor = "crosshair"; 
}
function pencilCursor(obj) {
    document.getElementById("canvases").style.cursor = "crosshair";
    isPaintable = true;

}
function saveImage(obj){
    let url = canvas.toDataURL("image/jpg");
    document.getElementById("save").href = url;
}
function Refresh(obj){
    console.log("hfshdods");
    draw.fillStyle = "white";
    draw.fillRect(0,0,canvas.width,canvas.height);

}
function eraserCursor(obj){
    console.log("nenlsd");
    document.getElementById("canvases").style.cursor = "url('New\ Piskel.png') ,default";
    isPaintable = false;
}
function changeColor(c){color = c;console.log(c);draw.strokeStyle=c;}
function check1() { chk = false; draw.beginPath();}
function draw1(obj) {
    if (chk && isPaintable) {
        console.log(isPaintable);
        draw.lineWidth = 5;
        // draw.strokeStyle = color;
        console.log(document.getElementById("heading").style.height);
        let optionsX = document.getElementById("options").offsetWidth;
        let wbBorder = 2, wbMargin = 2,optionMargin = 4;
        let headingY = document.getElementById("heading").offsetHeight;
        let x = window.event.clientX-optionsWidth-4*bodyMargin-(wbBorder+wbMargin)*2-2;
        let y = window.event.clientY-headingHeight-4*bodyMargin-(wbBorder+wbMargin)*2;
        draw.lineTo(x, y);
        draw.stroke();
    }
    if(chk && !isPaintable){
        draw.fillStyle = "white";
        let x = window.event.clientX-optionsWidth-4*bodyMargin-(wbBorder+wbMargin)*2+10;
        let y = window.event.clientY-headingHeight-4*bodyMargin-(wbBorder+wbMargin)*2+21;
        draw.fillRect(x,y,25,25);
        draw.strokeStyle = color;
    }
}
