import React from 'react'

export const SideBarUsers = (props) => {
  return (
    <div>
      {props.filterUsers.map((user) => (
        <button
          key={user._id}
          onClick={() => props.setselectedUser(user)}
          className={`
            w-full p-3 flex items-center gap-3
            hover:bg-base-300 transition-colors
            ${props.selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
          `}
        >
          <div className="relative mx-auto lg:mx-0">
            <img
              src={user.profilePic || "/avatar.png"}
              alt={user.name}
              className="size-12 object-cover rounded-full"
            />
            {
            props.onlineUsers.includes(user._id) && (
              <span
                className="absolute bottom-0 right-0 size-3 bg-green-500 
                rounded-full ring-2 ring-zinc-900"
              />
            )}
          </div>

          <div className="hidden lg:block text-left min-w-0">
            <div className="font-medium truncate">{user.fullName}</div>
            <div className="text-sm text-zinc-400">
              {props.onlineUsers.includes(user._id) ? "Online" : "Offline"}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}