import {Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import

export default function App() {
  const {authUser,checkAuth,isCheckingAuth} = useAuthStore

  useEffect(() => {
    checkAuth();
  },[checkAuth]);

  console.log({authUser});

if(isCheckingAuth && !authUser) return 
  <div className="flex justify-center items-center h-screen">
    <Loader className= "size-10 animate-spin"/>
  </div>
    
  return (
    <div>
      
      <Navbar />

      <Routes>
        <Route path="/" element={<h1><HomePage /></h1>}/>
        <Route path="/signup" element={<h1><SignupPage /></h1>}/>
        <Route path="/login" element={<h1><LoginPage /></h1>}/>
        <Route path="/settings" element={<h1><SettingsPage /></h1>}/>
        <Route path="/profile" element={<h1><ProfilePage /> </h1>}/>
      </Routes>

    </div>
  );
}
