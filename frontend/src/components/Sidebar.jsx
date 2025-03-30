import React, { useEffect, useState } from 'react'
import {useAuth} from "../store/useAuth"
import {useChat} from "../store/useChat"
import { SideBarUsers } from './SideBarUsers.jsx'

export const Sidebar = () => {
  const {onlineUsers} = useAuth()
  const {getUsers, users, selectedUser, setselectedUser, isUserLoading} = useChat()
  const [showOnlineUsers, setshowOnlineUsers] = useState(false);
  
  useEffect(()=>{
    getUsers();
  },[getUsers])
  
  const filterUsers = showOnlineUsers ? users.filter((user)=>{
    return onlineUsers.includes(user._id)
  }) : users

  if(isUserLoading) return <div>Loading...</div>

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
    <div className="border-b border-base-300 w-full p-5">
      <div className="flex items-center gap-2">
        <users className="size-6" />
        <span className="font-medium hidden lg:block">Contacts</span>
      </div>

      <div className="mt-3 hidden lg:flex items-center gap-2">
        <label className="cursor-pointer flex items-center gap-2">
          <input
            type="checkbox"
            checked={showOnlineUsers}
            onChange={(e) => setshowOnlineUsers(e.target.checked)}
            className="checkbox checkbox-sm"
          />
          <span className="text-sm">Show online only</span>
        </label>
        {        
          onlineUsers.length>=1 ?
            <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
            :<span className="text-xs text-zinc-500">(No User is online)</span>
        }
      </div>
    </div>
    <div className="overflow-y-auto w-full py-3">
        {/* <SideBarUsers filterUsers={filterUsers} setselectedUser={setselectedUser} selectedUser={selectedUser}  OnlineUsers={OnlineUsers} /> */}
      {filterUsers.map((user) => (
        <button
          key={user._id}
          onClick={() => setselectedUser(user)}
          className={`
            w-full p-3 flex items-center gap-3
            hover:bg-base-300 transition-colors
            ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
          `}
        >
          <div className="relative mx-auto lg:mx-0">
            <img
              src={user.profilePic || "/avatar.png"}
              alt={user.name}
              className="size-12 object-cover rounded-full"
            />
            {onlineUsers.includes(user._id) && (
              <span
                className="absolute bottom-0 right-0 size-3 bg-green-500 
                rounded-full ring-2 ring-zinc-900"
              />
            )}
          </div>

          <div className="hidden lg:block text-left min-w-0">
            <div className="font-medium truncate">{user.fullName}</div>
            <div className="text-sm text-zinc-400">
              {onlineUsers.includes(user._id) ? "Online" : "Offline"}
            </div>
          </div>
        </button>
      ))}
   {filterUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      {/* {OnlineUsers.length-1 ?
        (showOnlineUsers && 
          <div className="text-center text-zinc-500 py-4">online users</div>
        ):
        (showOnlineUsers && 
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )
      } */}

    </div>
  </aside>
  )
}