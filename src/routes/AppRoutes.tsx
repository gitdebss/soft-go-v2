import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import FormRide from "../pages/FormRide";


export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/form-ride" element={<FormRide />} />
    </Routes>
  );
}