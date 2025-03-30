import express from "express"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import authRouter from "../routers/authRouter.js"
import msgRoute from "../routers/messageRoute.js"
import {connectDB}  from "../lib/db.js"
import cors from "cors";
import {app, server} from "../lib/socket.js"

dotenv.config()
const port = process.env.PORT
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
connectDB();
app.use("/api/auth",authRouter)
app.use("/api/messages",msgRoute)
server.listen(port,()=>{
    console.log("server is running on port "+port);
})
app.get('/', (req, res) => {
    res.send('Hello');
});