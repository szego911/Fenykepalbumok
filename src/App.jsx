import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Profil from "./components/Profil/Profil";
import BestImages from "./components/BestImages/BestImages";
import Varosok from "./components/Tables/Varosok/Varosok";
import Albums from "./components/Albums/Albums";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/best_images" element={<BestImages />} />
          <Route path="/categories" element={<BestImages />} />
          <Route path="/image/:id" element={<BestImages />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/varosok" element={<Varosok />} />
          <Route path="/albums" element={<Albums />} />

          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
