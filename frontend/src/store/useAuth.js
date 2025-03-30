import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
import {toast} from "react-hot-toast"
import { io } from "socket.io-client"
const BASE_URL = "http://localhost:5000"

export const useAuth = create((set,get) => ({
    authUser: null,
    isSigningUp:false,
    isLogging:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers : [],
    socket:null,

    checkAuth:async()=>{
        try {
            const res = await axiosInstance.get("/auth/check")
            set({authUser:res.data})
            get().connectSocket()
        } catch (error) {
            console.log("Error in checkauth file1",error)
            set({authUser:null})
        }
        finally{
            set({isCheckingAuth:false})
        }
    },

    signUpForm : async(data)=>{
        set({isSigningUp:true})
        try {
            const res = await axiosInstance.post("/auth/signup",data);
            set({authUser:res.data})
            toast.success("Account Created Successfully");
            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message);
            console.log("Error in signup--> ",error.message)
        }
        finally{
            set({isSigningUp:false})
        }
    },

    login : async(data)=>{
        set({isLogging:true})
        try {
            const res = await axiosInstance.post("/auth/login",data);
            set({authUser:res.data})
            toast.success("Logged In Successfully");
            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message);
            console.log("Error in login--> ",error.message);
        }
        finally{
            set({isLogging:false})
        }
    },

    logout : async()=>{
        try {
            const res = axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logged Out Successfully");
            get().disconnectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("error in update profile:", error);
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: ()=>{
        const {authUser} = get()
        if(!authUser || get().socket?.connected) return    //if not login user return 
        
        const socket = io(BASE_URL,{
            query: { userId: authUser._id }
        })
        socket.connect()
        set({ socket: socket });
        // console.log("socket: ",socket)
        // must match with io.emit function name from backend(socket.js)
        socket.on("getOnlineUser",(userIds)=>{
            set({onlineUsers:userIds})
        })
    },

    disconnectSocket: async()=>{
        if (get().socket?.connected) get().socket.disconnect();
    }

}))