import React, { useState, Component } from "react";
import "./Profil.css";
import Sidebar from "../Sidebar/Sidebar";
import { Link } from "react-router";

const Profil = () => {
  const [uname, setUname] = useState("kovacsjanos69");
  const [email, setEmail] = useState("default@gmail.com");
  const [city, setCity] = useState("Budapest");
  const [regdate, setRegDate] = useState("1999.01.01.");

  const myfuntion = () => {
    setUname("username");
    setEmail("setter@set.hu");
    setCity("City");
    setRegDate("2023.10.01.");
  };
  return (
    <div className="d-flex vh-100 custom-bg">
      <Sidebar />
      <div className="profil shadow">
        <img src="./anonym-picture.png" alt="anonym-picture.png" />
        <br />
        <label
          for="real-file-input"
          class="btn btn-secondary btn-sm custom-file-upload mb-4 btn-sm rounded-pill px-4"
        >
          Új profilkép feltöltése
        </label>
        <input
          type="file"
          id="real-file-input"
          name="myImage"
          accept="image/png, image/gif, image/jpeg"
        />
        <p>
          <b>Felhasználónév: </b>
          {uname} <br />
        </p>
        <p>
          <b>Email-cím: </b>
          {email} <br />
        </p>
        <p>
          <b>Lakhely: </b>
          {city} <br />
        </p>
        <p>
          <b>Regisztráció dátuma: </b>
          {regdate} <br />
        </p>

        <button className="btn btn-danger mt-4">Profil törlése</button>
      </div>
    </div>
  );
};

export default Profil;
