import React, { useState } from "react";
import { useNavigate } from "react-router";
import "./Profil.css";
import "../../pages/css/Main.css";
import Sidebar from "../Sidebar/Sidebar";
import { useAuth } from "../../hooks/useAuth";

//TODO: needs more work, renavigate when no userdata
const Profil = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

  const [uname, setUname] = useState(user?.nev || "");
  const [email, setEmail] = useState(user?.email || "");
  const [city, setCity] = useState(user?.cityId || "");
  const [regdate, setRegDate] = useState(user?.reg_datum || "");

  if (!isLoggedIn) {
    return (
      <div className="d-flex vh-100 custom-bg">
        <Sidebar />
        <div className="profil shadow">
          Kérlek jelentkezz be{" "}
          <a href="/login">
            <span className="text-primary underline-on-hover">itt</span>
          </a>
          , hogy használni tudd!
        </div>
      </div>
    );
  }

  function formatDateToYMD(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const logOut = () => {
    localStorage.removeItem("userData");
    navigate("/");
  };

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

        <div className="d-flex gap-3 justify-content-center ">
          <button onClick={logOut} className="btn btn-primary mt-4">
            Kijelentkezés
          </button>
          <button className="btn btn-danger mt-4">Profil törlése</button>
        </div>
      </div>
    </div>
  );
};

export default Profil;
