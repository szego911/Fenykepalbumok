import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Profil from "./components/Profil/Profil";
import BestImages from "./components/BestImages/BestImages";
import Varosok from "./components/Admin/CitiyList";
import Albums from "./components/Albums/Albums";
import Admin from "./components/Admin/Admin";
import Categories from "./components/Categories/Categories";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/best_images" element={<BestImages />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/varosok" element={<Varosok />} />
          <Route path="/albums" element={<Albums />} />
          <Route path="/admin" element={<Admin />} />

          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
