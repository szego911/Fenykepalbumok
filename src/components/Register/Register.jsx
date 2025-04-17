import React, { Component } from "react";
import "./Register.css";
import { Link } from "react-router";
import Sidebar from "../Sidebar/Sidebar";

const Presenter = () => {
  return (
    <div className="d-flex vh-100 custom-bg align-items-center">
      <Sidebar />
      <div className="login">
        <div className="mt-20 login-container shadow">
          <h1 className="text-center poppins">Regisztráció</h1>
          <form>
            <div className="form-group">
              <label htmlFor="username">Felhasználónév</label>
              <input
                type="text"
                className="form-control"
                id="username"
                aria-describedby="emailHelp"
                name="username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email-cím</label>
              <input
                type="email"
                className="form-control"
                id="email"
                aria-describedby="emailHelp"
                name="email"
              />
              <small id="emailHelp" className="form-text text-muted">
                We'll never share your email with anyone else.
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="location">Lakcím</label>
              <input
                type="text"
                className="form-control"
                id="location"
                name="location"
              />
            </div>

            <div className="row mb-3">
              <div className="col-md-7">
                <div className="input-group input-group-sm">
                  <label className="input-group-text" htmlFor="megyeSelect">
                    Megye
                  </label>
                  <select
                    className="form-select"
                    id="county"
                    aria-label="Megye kiválasztása"
                    name="county"
                  >
                    <option defaultValue disabled></option>
                    <option value="bp">Budapest</option>
                    <option value="bk">Bács-Kiskun</option>
                    <option value="baz">Borsod-Abaúj-Zemplén</option>
                    <option value="fe">Fejér</option>
                    <option value="gyms">Győr-Moson-Sopron</option>
                    <option value="hb">Hajdú-Bihar</option>
                    <option value="ke">Komárom-Esztergom</option>
                    <option value="jnsz">Jász-Nagykun-Szolnok</option>
                    <option value="be">Békés</option>
                    <option value="ba">Baranya</option>
                    <option value="no">Nógrád</option>
                    <option value="pest">Pest</option>
                    <option value="so">Somogy</option>
                    <option value="tolna">Tolna</option>
                    <option value="vas">Vas</option>
                    <option value="vesz">Veszprém</option>
                    <option value="zala">Zala</option>
                    <option value="cscs">Csongrád-Csanád</option>
                    <option value="he">Heves</option>
                    <option value="szszb">Szabolcs-Szatmár-Bereg</option>
                  </select>
                </div>
              </div>

              <div className="col-md-5">
                <div className="input-group input-group-sm">
                  <span className="input-group-text" id="inputGroup-sizing-sm">
                    Irányítószám
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    aria-label="Irányítószám"
                    aria-describedby="inputGroup-sizing-sm"
                    maxLength="4"
                    name="zip"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password1">Jelszó</label>
              <input
                type="password"
                className="form-control"
                id="password1"
                name="password1"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password2">Jelszó megerősítése</label>
              <input
                type="password"
                className="form-control"
                id="password2"
                name="password2"
              />
            </div>
          </form>

          <button type="button" className="btn btn-primary">
            Regisztráció
          </button>
          <div className="d-flex justify-content-end">
            <Link to="/login">
              <span className="text-primary">Van már fiókom</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Presenter;
