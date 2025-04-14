import React, { Component } from "react";
import "./Register.css";
import { Link } from "react-router";
import Sidebar from "../Sidebar/Sidebar";

const Presenter = () => {
  return (
    <div className="d-flex vh-100">
      <Sidebar />
      <div className="login">
        <div className="login-container">
          <h1 class="">Regisztráció</h1>
          <form>
            <div class="form-group">
              <label for="exampleInputEmail1">Email address</label>
              <input
                type="email"
                class="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter email"
              />
              <small id="emailHelp" class="form-text text-muted">
                We'll never share your email with anyone else.
              </small>
            </div>
            <div class="form-group">
              <label for="exampleInputPassword1">Password</label>
              <input
                type="password"
                class="form-control"
                id="exampleInputPassword1"
                placeholder="Password"
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

export default Presenter;
