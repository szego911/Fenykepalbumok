import React, { useState } from "react";
import "./Login.css";
import { Link } from "react-router";
import Sidebar from "../Sidebar/Sidebar";

const Login = () => {
  return (
    <div className="d-flex vh-100">
      <Sidebar />
      <div className="login">
        <div className="login-container">
          <h1>Bejelentkezés</h1>
          <form>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Email-cím</label>
              <input
                type="email"
                class="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder=""
              />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Jelszó</label>
              <input
                type="password"
                class="form-control"
                id="exampleInputPassword1"
                placeholder=""
              />
            </div>
          </form>

          <button type="button" className="btn btn-primary">
            Bejelentkezés
          </button>
          <p className="login-login">
            Nincs még fiókod? Regisztrálj{" "}
            <Link to="/register">
              <span>itt</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
