import React, { useState, Component } from "react";
import "./Profil.css";
import Sidebar from "../Sidebar/Sidebar";
import { Link } from "react-router";

const Profil = () => {
  const [email, setEmail] = useState("default@gmail.com");

  const myfuntion = () => {
    setEmail("setter@set.hu");
  };
  return (
    <div className="d-flex vh-100">
      <Sidebar />
      <div className="profil">
        <h1>{email}</h1>
        <button onClick={myfuntion}>gomb</button>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta,
          consequuntur! Quod culpa dolorum voluptatum esse autem. Sint itaque
          vel suscipit! Explicabo error iste eveniet cupiditate, magni sint
          totam laudantium. Quia?
        </p>
        <h3>ajibubascnsma</h3>
      </div>
    </div>
  );
};

export default Profil;
