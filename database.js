const Client = require("pg").Client;
const client = new Client({
    user:"postgres",
    host:"localhost",
    password:"1234",
    database:"Whiteboard",
    port:5432,
});
client.connect();

const insert = "INSERT INTO koushik VALUES ($1,$2,$3,$4,$5,$6,$7)";
const update = "UPDATE ROOM SET user_ids = $1 where room_id = $2";
const select = "SELECT * FROM koushik where uname = $1 AND pass = $2";
const getUserName = "SELECT firstname FROM koushik where uId=$1";
const getAll = "SELECT * FROM koushik"
module.exports={client,select,insert,getUserName,getAll};
