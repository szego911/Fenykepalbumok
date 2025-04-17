import React, { useState } from "react";
import "./Login.css";
import { Link } from "react-router";
import Sidebar from "../Sidebar/Sidebar";

const Login = () => {
  return (
    <div className="d-flex vh-100 custom-bg align-items-center">
      <Sidebar />
      <div className="login">
        <div className="login-container shadow">
          <h1 class="text-center poppins">Bejelentkezés</h1>
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
              <span class="text-primary underline-on-hover">itt</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
