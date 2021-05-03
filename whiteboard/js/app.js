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
var roomId = -1;
chk = false;
var a = true;
draw.lineWidth = 5;
draw.lineCap = 'round';
var writeText = false;
var hasInput = false;
var drawShape = false;
var shape = 0;
var startx = 0, starty = 0, endx = 0, endy = 0;
var lineWidth = 5;
var eraserSize = 25;
/**   CATCH THE EVENTS HERE   **/
socket.emit("AssignRoom");
socket.on("kou", rId => {
    console.log("kou", rId);
    roomId = rId;
})
socket.on("DrawExistingCanvas", (obj1, obj2) => {
    if (a) {
        console.log(obj1);
        var i;
        for (i = 0; i < obj1.length; i++) {
            if (obj1[i] == -1) {
                draw.beginPath();
                continue;
            }
            console.log("hello");
            draw.strokeStyle = obj1[i]['color'];
            draw.lineTo(obj1[i]['x'], obj1[i]['y']);
            draw.stroke();
        }
        for (i = 0; i < obj2.length; i++) {
            draw.fillStyle = "white";
            draw.fillRect(obj2[i]['x'], obj2[i]['y'], 25, 25);
        }
        draw.beginPath();
    }
    a = !a
});
socket.on("DrawingCoordinatesFromServer", obj => {
    draw.strokeStyle = obj['color'];
    draw.lineTo(obj['x'], obj['y']);
    draw.stroke();
    draw.strokeStyle = color;
});

socket.on("EraseCoordinatesFromServer", obj => {
    draw.fillStyle = "white";
    draw.fillRect(obj['x'], obj['y'], 25, 25);
});

socket.on("RefreshTheScreenFromServer", msg => {
    draw.fillStyle = "white";
    draw.fillRect(0, 0, canvas.width, canvas.height);
});

socket.on("StopDrawingFromServer", () => {
    draw.beginPath();
});
/* */


/**   FOR COMMUNICATING WITH FRONT END   **/
//Enable Drawing

canvas.onclick = function (e) {
    console.log(hasInput, writeText);
    if (hasInput) {
        return;
    }
    else if (writeText && !hasInput) {
        addInput(startx, starty);
        window.document.getElementById("canvases").style.cursor = "auto";
    }
}

function addInput(x, y) {
    var input = document.createElement('input');
    input.type = 'text';
    input.style.position = 'fixed';
    input.style.left = (startx + 110) + 'px';
    input.style.top = (starty + 60) + 'px';
    input.style.width = (endx - startx) > 250 ? (endx - startx - 20) + 'px' : '230px';
    input.style.overflow = 'scroll';
    document.body.appendChild(input);
    input.focus();
    hasInput = false;
    writeText = false;
    draw.setLineDash([0, 0]);
}
function KeepDrawing() {
    chk = true;
    if (drawShape == true || writeText == true) {
        chk = false;
        startx = window.event.clientX - optionsWidth - 2 * bodyMargin - (wbBorder + wbMargin) * 2 - 2;// relative position from
        starty = window.event.clientY - headingHeight + bodyMargin - (wbBorder + wbMargin) * 2;// absolute positions;
    }
}

//Make the cursor to crosshair and enable drawing
function pencilCursor(obj, val) {
    draw.lineWidth = 5 * val;
    lineWidth = draw.lineWidth;
    window.document.getElementById("canvases").style.cursor = "crosshair";
    isPaintable = true;
    drawShape = false;
    writeText = false;
}

//Download the image drawn
function saveImage(obj) {
    let url = canvas.toDataURL("image/jpg");
    window.document.getElementById("save").href = url;
}

function drawLine(obj, ch) {
    shape = ch;
    isPaintable = false;
    writeText = false;
    draw.lineWidth = 2;
    window.document.getElementById("canvases").style.cursor = "crosshair";
    drawShape = true;
}

function textCursor(obj) {
    isPaintable = false;
    drawShape = false;
    window.document.getElementById("canvases").style.cursor = "crosshair";
    writeText = true;
}


//Refresh the entire screen
function Refresh(obj) {
    console.log("hfshdods");
    draw.fillStyle = "white";
    draw.fillRect(0, 0, canvas.width, canvas.height);
    var texts = window.document.getElementsByTagName("input");
    console.log(texts);
    for (var i = 0; i < texts.length; i++)
        if (texts[i].type == 'text')
            texts[i].remove();
    //Send a signal to refresh the entire screen
    socket.emit("RefreshTheScreen", roomId);
}


//Change cursor to white rectangle and enable erasing
function eraserCursor(obj, val) {
    if (val == 1)
        window.document.getElementById("canvases").style.cursor = "url('images/New\ Piskel.png') ,default";
    else if (val == 1.5)
        window.document.getElementById("canvases").style.cursor = "url('images/New\ Piskel-2.png') ,default";
    else
        window.document.getElementById("canvases").style.cursor = "url('images/New\ Piskel-4.png') ,default";
    eraserSize = 25 * val;
    isPaintable = false;
    drawShape = false;
    writeText = false;
}

//Change the color of pencil
function changeColor(col) {
    color = col;
    draw.strokeStyle = col;
}
//Disable chk
function stopDrawingOnCanvas() {
    chk = false;
    endx = window.event.clientX - optionsWidth - 2 * bodyMargin - (wbBorder + wbMargin) * 2 - 2;// relative position from
    endy = window.event.clientY - headingHeight + bodyMargin - (wbBorder + wbMargin) * 2;// absolute pos
    if (drawShape == true && shape == 1) {
        isPaintable = false;
        eraserSize = 0;
        draw.moveTo(startx, starty);
        draw.lineTo(endx, endy);
        draw.stroke();
    }
    else if (drawShape == true && shape == 2) {
        isPaintable = false;
        eraserSize = 0;
        canvas_arrow(startx, starty, endx, endy);
    }
    else if (drawShape == true && shape == 3) {
        isPaintable = false;
        eraserSize = 0;
        draw.rect(startx, starty, endx - startx, endy - starty);
        draw.stroke();
    }
    else if (drawShape == true && shape == 4) {
        isPaintable = false;
        eraserSize = 0;
        var a = Math.max(endx - startx, endy - starty);
        draw.rect(startx, starty, a, a);
        draw.stroke();
    }
    else if (drawShape == true && shape == 5) {
        isPaintable = false;
        eraserSize = 0;
        var a = Math.max(endx - startx, endy - starty);
        draw.arc(startx + (a / 2), starty + (a / 2), a, 0, 2 * Math.PI);
        draw.stroke();
    }
    else if (drawShape == true && shape == 6) {
        isPaintable = false;
        eraserSize = 0;
        var a = 2 * (endy - starty) / (Math.sqrt(3));
        draw.moveTo(startx, starty);
        draw.lineTo(startx - (a / 2), endy);
        draw.lineTo(startx + (a / 2), endy);
        draw.moveTo(startx, starty);
        draw.lineTo(startx + (a / 2), endy);
        draw.stroke();
    }
    else if (writeText == true) {
        isPaintable = false;
        eraserSize = 0;
        draw.setLineDash([5, 5]);
        draw.lineWidth = 2;
        draw.moveTo(startx, starty);
        if (endx - startx < 250)
            draw.rect(startx, starty, 250, 50);
        else
            draw.rect(startx, starty, endx - startx, 50);
        draw.stroke();
    }
    draw.beginPath();
    //Send a signal to stop drawing
    socket.emit("StopDrawing", roomId);
}
function canvas_arrow(fromx, fromy, tox, toy) {
    var headlen = 10; // length of head in pixels
    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    draw.moveTo(fromx, fromy);
    draw.lineTo(tox, toy);
    draw.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    draw.moveTo(tox, toy);
    draw.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    draw.stroke();
}
function toggleMode(obj) {
    var heading = window.document.getElementById("heading");
    var side_nav = window.document.getElementById("side");
    var body = window.document.getElementsByTagName("body")[0];
    var icons = window.document.getElementsByTagName("i");
    var eraserdrop = window.document.getElementById("eraser_drop");
    var pencildrop = window.document.getElementById("pencil_drop");
    //change to dark mode
    if (toggle == false) {
        heading.classList.remove("heading-light");
        heading.classList.add("heading-dark");
        side_nav.classList.remove("toolbar-light");
        side_nav.classList.add("toolbar-dark");
        body.style.backgroundColor = "#121212";
        pencildrop.style.backgroundColor = "#1F1F1F";
        eraserdrop.style.backgroundColor = "#1F1F1F";
        for (var i = 0; i < icons.length; i++) {
            icons[i].classList.remove("cursor-light", "light-text");
            icons[i].classList.add("cursor-dark", "dark-text");
        }

        toggle = true;
    }
    //change to light-mode
    else {
        heading.classList.remove("heading-dark");
        heading.classList.add("heading-light");
        side_nav.classList.remove("toolbar-dark");
        side_nav.classList.add("toolbar-light");
        body.style.backgroundColor = "white";
        eraserdrop.style.backgroundColor = "white";
        pencildrop.style.backgroundColor = "white";
        for (var i = 0; i < icons.length; i++) {
            icons[i].classList.remove("cursor-dark", "dark-text");
            icons[i].classList.add("cursor-light", "light-text");
        }

        toggle = false;
    }
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
            'x': x,
            'y': y,
            'color': color,
            "roomId": roomId
        }
        //Whenever the user is drawing, send the current position where the event is happening
        socket.emit("DrawingCoordinates", jsonObject);
    }
    //Eraser
    if (chk && !isPaintable) {
        draw.fillStyle = "white";
        let x = window.event.clientX - optionsWidth - 4 * bodyMargin - (wbBorder + wbMargin) * 2 + 10;// relative position from
        let y = window.event.clientY - headingHeight - 4 * bodyMargin - (wbBorder + wbMargin) * 2 + 21;// absolute positions
        draw.fillRect(x, y, 25, 25);
        const jsonObject = {
            'x': x,
            'y': y,
            "roomId": roomId
        }
        //Whenever the user is drawing, send the current position where the event is happening
        socket.emit("EraseCoordinates", jsonObject);

    }
}
/* */