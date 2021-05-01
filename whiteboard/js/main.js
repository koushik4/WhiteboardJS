const socket = io();

function CreateTheRoom() {
    socket.emit("CreateRoomWithRoomId")
}
function JoinTheRoom() {
    socket.emit("JoinRoomWithRoomId","0")
}