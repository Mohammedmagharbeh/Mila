import React,{useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // لاستدعاء التنقل بين الصفحات
import '../App.css'

const Login=()=>{

    const [username,setusername]=useState('')
    const [password,setpassword]=useState('')
    const [Token,setToken]=useState('')
    const [userData,setuserData]=useState(null)
    const navigate=useNavigate()
    
    
    const Loginhandler=async(e)=>{
        e.preventDefault()
        try{
            
            const res=await axios.post("http://127.0.0.1:5000/api/login",{username,password})
            setToken(res.data.token)
            sessionStorage.setItem('jwt',res.data.token)
            
            alert('login sucssfully')
            navigate('/')
        }
       catch(error){
        alert('invalid data')
       }
    }

return(
    <>
    <h1>
        log in page
    </h1>
    <>
  <h1 className="login-header">Welcome Back</h1>
  <form onSubmit={Loginhandler} className="loginn-form">
    <input type="text"placeholder="Username" value={username} onChange={(e) => setusername(e.target.value)}required className="input-field"/>
    <input type="password" placeholder="Password"  value={password} onChange={(e) => setpassword(e.target.value)} required className="input-field"/>
    <button type="submit" className="log-button">Login</button>
  </form>
</>

    </>
)

}






export default Login