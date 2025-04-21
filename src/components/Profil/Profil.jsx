/* eslint-disable no-unused-vars */
import React, { useState, Component } from "react";
import "./Profil.css";
import Sidebar from "../Sidebar/Sidebar";
import { Link } from "react-router";

//TODO: needs more work, renavigate when no userdata
const Profil = () => {
  const user = JSON.parse(localStorage.getItem("userData"));

  const [uname, setUname] = useState(user.nev);
  const [email, setEmail] = useState(user.email);
  const [city, setCity] = useState(user.cityId);
  const [regdate, setRegDate] = useState(user.reg_datum);

  function formatDateToYMD(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // hónap: 0-indexelt
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return (
    <div className="d-flex vh-100 custom-bg">
      <Sidebar />
      <div className="profil shadow">
        <img src="./anonym-picture.png" alt="anonym-picture.png" />
        <br />
        <label
          htmlFor="real-file-input"
          className="btn btn-secondary btn-sm custom-file-upload mb-4 btn-sm rounded-pill px-4"
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
          {formatDateToYMD(regdate)} <br />
        </p>

        <button className="btn btn-danger mt-4">Profil törlése</button>
      </div>
    </div>
  );
};

export default Profil;
