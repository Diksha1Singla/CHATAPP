import jwt from "jsonwebtoken"
import user from "../models/userModels.js"

export const protectRoute = async(req,res,next)=>{
    try {
        // const token = req.headers['token']
        const token = req.cookies.jwt
        // console.log("Ntoken: ",token)
        if(!token){
            return res.status(401).json({message:"Unauthorized - Please Login First"})
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded){
            return res.status(401).json({message:"Unauthorized - InValid Login Details"})
        }
        const userD = await user.findById(decoded.userId).select("-password");
        if(!userD){
            return res.status(401).json({message:"Unauthorized - InValid Login Details!User Not Found"})
        }
        req.user = userD;
        next();

    } catch (error) {
        console.log("Error in protectRoute middleware: ",error.message)
        return res.status(500).json({message:"Internal Error"})
    }
}