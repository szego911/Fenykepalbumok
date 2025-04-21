import React, { useState } from "react";
import { useNavigate } from "react-router";
import "./Login.css";
import { Link } from "react-router";
import Sidebar from "../Sidebar/Sidebar";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    const raw = JSON.stringify({
      email,
      password,
    });

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:4000/api/login", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem("userData", JSON.stringify(data.user));
          alert("Sikeres bejelentkezés!");
          navigate("/profil");
        } else {
          throw new Error(
            "Server returned unsuccessful response!" + data.error
          );
        }
      })
      .catch((error) => console.error(error));
  };
  return (
    <div className="d-flex vh-100 custom-bg align-items-center">
      <Sidebar />
      <div className="login">
        <div className="login-container shadow">
          <h1 className="text-center poppins">Bejelentkezés</h1>
          <form>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Email-cím</label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder=""
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Jelszó</label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                placeholder=""
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </form>

          <button type="button" className="btn btn-primary" onClick={login}>
            Bejelentkezés
          </button>
          <p className="login-login">
            Nincs még fiókod? Regisztrálj{" "}
            <Link to="/register">
              <span className="text-primary underline-on-hover">itt</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
