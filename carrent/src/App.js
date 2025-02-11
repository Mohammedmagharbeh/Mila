import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import DashboardLayoutNoMiniSidebar from "./component/dashboard";
import Milarent from "./component/mila";
import Users from "./component/users";
import Reservation from "./component/Reservation";
import Foruser from "./component/forusers";
import RegistrationForm from "./component/Registration";
import Login from "./component/LoginCheck";
import UserReservations from "./component/Booking";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Milarent />} />
        <Route path="/user" element={<Users />} />
        <Route path="/Reservation" element={< Reservation/>} />
        <Route path="/foruser" element={< Foruser/>} />
        <Route path="/registration" element={< RegistrationForm/>} />
        <Route path="/login" element={< Login/>} />
        <Route path="/Booking" element={< UserReservations/>} />


        




      </Routes>
    </BrowserRouter>
  );
}

export default App;