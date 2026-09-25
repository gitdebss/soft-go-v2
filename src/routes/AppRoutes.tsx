import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import FormRide from "../pages/FormRide";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import MyRides from "../pages/MyRides";


export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/form-ride" element={<FormRide />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/my-rides" element={<MyRides />} />
    </Routes>
  );
}