import mongoose from "mongoose"

export const connectDB = async()=>{
    try {
        const response = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${response.connection}`);
    } catch (error) {
        console.log(error.message);
    }
}