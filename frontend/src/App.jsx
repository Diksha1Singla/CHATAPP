import { Routes, Route, Navigate } from "react-router-dom";
import {SettingsPage} from "./pages/SettingsPage.jsx"
import {LoginPage} from "./pages/LoignPage.jsx"
import {SignUpPage} from "./pages/SignUpPage.jsx"
import {HomePage} from "./pages/HomePage.jsx"
import {ProfilePage} from "./pages/ProfilePage.jsx"
import {Navbar} from "./components/Navbar.jsx"
import { useAuth } from "./store/useAuth.js";
import { useEffect } from "react";
import {Loader} from "lucide-react"
import {Toaster} from "react-hot-toast";
import { useTheme } from "./store/useThemes.js";

const App = ()=>{
  const{theme} = useTheme();
  const {checkAuth, authUser, isCheckingAuth, onlineUsers} = useAuth();
  useEffect(()=>{
    checkAuth()
  },[checkAuth])
  // console.log("authUser: ",authUser);
  // console.log("Online users: ",onlineUsers)
  if(isCheckingAuth && !authUser){
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin"/>
      </div>
    )
  }
  return (
    <div data-theme = {theme}>
      <Navbar/>
      <Routes>
        <Route path="/" element={authUser ? <HomePage/> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage/> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage/>} />
        <Route path="/profile" element={authUser ? <ProfilePage/> : <Navigate to="/login" />} />
      </Routes>
      <Toaster/>
    </div>
  )
}
export default App;