import React, { Component } from "react";
import "./Register.css";
import { Link } from "react-router";
import Sidebar from "../Sidebar/Sidebar";

const Presenter = () => {
  return (
    <div className="d-flex vh-100 custom-bg align-items-center">
      <Sidebar />
      <div className="login">
        <div className="login-container shadow">
          <h1 class="text-center poppins">Regisztráció</h1>
          <form>
            <div class="form-group">
              <label for="username">Felhasználónév</label>
              <input
                type="text"
                class="form-control"
                id="username"
                aria-describedby="emailHelp"
                name="username"
              />
            </div>
            <div class="form-group">
              <label for="email">Email-cím</label>
              <input
                type="email"
                class="form-control"
                id="email"
                aria-describedby="emailHelp"
                name="email"
              />
              <small id="emailHelp" class="form-text text-muted">
                We'll never share your email with anyone else.
              </small>
            </div>
            <div class="form-group">
              <label for="location">Lakcím</label>
              <input
                type="text"
                class="form-control"
                id="location"
                name="location"
              />
            </div>

            <div class="row mb-3">
              <div class="col-md-7">
                <div class="input-group input-group-sm">
                  <label class="input-group-text" for="megyeSelect">
                    Megye
                  </label>
                  <select
                    class="form-select"
                    id="county"
                    aria-label="Megye kiválasztása"
                    name="county"
                  >
                    <option selected disabled></option>
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

              <div class="col-md-5">
                <div class="input-group input-group-sm">
                  <span class="input-group-text" id="inputGroup-sizing-sm">
                    Irányítószám
                  </span>
                  <input
                    type="text"
                    class="form-control"
                    aria-label="Irányítószám"
                    aria-describedby="inputGroup-sizing-sm"
                    maxlength="4"
                    name="zip"
                  />
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="password1">Jelszó</label>
              <input
                type="password"
                class="form-control"
                id="password1"
                name="password1"
              />
            </div>
            <div class="form-group">
              <label for="password2">Jelszó megerősítése</label>
              <input
                type="password"
                class="form-control"
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
              <span class="text-primary">Van már fiókom</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Presenter;
