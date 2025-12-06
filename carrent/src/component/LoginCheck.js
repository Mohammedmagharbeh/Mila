import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import "../css/log.css";

  
const Login = () => {

    if (window.location.pathname === '/login') {
        document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1739382122928-589c2221853c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
        document.body.style.backgroundRepeat = "no-repeat";
        document.body.style.backgroundSize = "cover";  // جعل الصورة تغطي الشاشة بالكامل
      
      } 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const Loginhandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:5000/api/login", { username, password });
      sessionStorage.setItem("jwt", res.data.token);
      sessionStorage.setItem("username", username);
      alert("تم تسجيل الدخول بنجاح");
      navigate("/");
    } catch (error) {
      alert("بيانات غير صحيحة");
    }
  };

  

  return (
    <div className="login-container">
      {/* الوشاح المتحرك */}
      <div className="animated-ribbon"></div>

      {/* العنوان الرئيسي */}
      <h1 className="login-header">🚗 Welcome to MilaRent</h1>

      {/* حركة سيارة متحركة لإضافة لمسة تفاعلية */}
      <motion.div
        className="car-animation"
        animate={{ x: [0, 100, -100, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      >
        🚗💨
      </motion.div>

      {/* نموذج تسجيل الدخول */}
      <form onSubmit={Loginhandler} className="loginn-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-field"
        />
        <button type="submit" className="log-button">Login</button>
      </form>

      {/* زر التسجيل مع تأثيرات Framer Motion */}
      <motion.button 
        onClick={()=>{    navigate("/Registration");
        }} 
        className="reg-button"
        whileHover={{ scale: 1.1, boxShadow: "0px 0px 15px rgba(255,255,255,0.8)" }}
        whileTap={{ scale: 0.9 }}
      >
      </motion.button>
    </div>
  );
};
  
export default Login;
