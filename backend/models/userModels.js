import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    fullName:{
        type:String,
        required:true
    },
    password:{  
        type:String,
        required:true,
        minLength:6
    },
    profilePic:{
        type:String,
        default:""
    }
},
{timestamps:true}
);

const Users = mongoose.model("UserData",userSchema);
export default Users;

// Users is what we access and UserData is what mongoDB stores