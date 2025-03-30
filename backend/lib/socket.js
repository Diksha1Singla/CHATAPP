import http from "http"
import { Server } from "socket.io"
import express from "express"

const app = express()
const server = http.createServer(app)

const io = new Server(server,{
    cors:{
        origin:["http://localhost:5173"]
    }
})

export function getRecieverSocketId(userId){
    return userSocketMap[userId]
}
const userSocketMap = {}  //userId:socketId

io.on("connection",(socket)=>{
    console.log("client connected: ",socket.id)
    const userId = socket.handshake.query.userId    // getting user just loggedIn
    if(userId) userSocketMap[userId] = socket.id    //mapping user to socket
    // console.log("keys: ",Object.keys(userSocketMap))
    // io.emit broadcast to all connected clients
    io.emit("getOnlineUser",Object.keys(userSocketMap))  //created a fn for sending event to all the connected clients: sending keys(which are user ids)
    socket.on("disconnect",()=>{
        console.log("Client disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUser", Object.keys(userSocketMap));
    })
})

export { io, app, server }