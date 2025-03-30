import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

import {create} from "zustand"
import { useAuth } from './useAuth';

export const useChat = create((set,get)=>({
    messages: [],
    users: [],
    isLoadingUser: false,
    isLoadingMsg: false,
    selectedUser: null,

    getUsers: async()=>{
        set({isLoadingUser:true});
        try {
            const res = await axiosInstance.get("/messages/users");
            // console.log("res of GetUser: ",res);
            set({users:res.data})
        } catch (error) {
            console.log("Error in getUsers useChat")
            toast.error(error.response.data.messgae)
        }
        finally{
            set({isLoadingUser:false});
        }
    },

    getMessages: async(userId)=>{
        set({isLoadingMsg:true})
        try {
            const res = await axiosInstance.get(`/messages/${userId}`)
            set({messages:res.data})
        } catch (error) {
            console.log("Error in getMessages useChat")
            toast.error(error.response.data.messgae)
        }
        finally{
            set({isLoadingMsg:false})
        }
    },

    sendMessages:async(Data)=>{
        const {messages, selectedUser} = get();
        try {
            const newMsg = await axiosInstance.post(`/messages/send/${selectedUser._id}`,Data)
            // console.log("msg: ",newMsg)
            set({messages:[...messages,newMsg.data]})
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },
    // for real time data
    subscribeToMessages: ()=>{
        const {selectedUser, messages} = get()
        if(!selectedUser) return;
        const socket = useAuth.getState().socket
        // console.log("Socket, ",socket)
        socket.on('newMessage', (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;
            set((state)=>({
                messages: [...state.messages, newMessage],
            }))
            // (without state only recent message will be showed in reciever side)Why? Directly spreading messages might use an outdated state due to React's async nature. 
            // Using (state) => ({ messages: [...state.messages, newMessage] }) ensures state updates properly.
        })
    },
    UnsubscribeToMessages:()=>{
        const socket = useAuth.getState().socket;
        socket.off('newMessage');
    },
    setselectedUser : async(CurrUser)=>{
        set({selectedUser:CurrUser})
    }
}))