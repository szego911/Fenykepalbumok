import React, { useState } from "react";
import { useNavigate } from "react-router";
import "../../Login/Login.css";
import { Link } from "react-router";
import Sidebar from "../../Sidebar/Sidebar";

const Varosok = () => {
  const [nev, setNev] = useState("");
  const [megye, setMegye] = useState("");
  const [iranyitoszam, setIranyitoszam] = useState("");

  const createVaros = () => {
    const raw = JSON.stringify({
      nev,
      megye,
      iranyitoszam,
    });

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:4000/api/create/varos", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Város hozzáadva");
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
        <div className="mt-20 login-container shadow">
          <h1 className="text-center poppins">Új város hozzáadása</h1>
          <form>
            <div className="form-group">
              <label htmlFor="username">Város neve</label>
              <input
                type="text"
                className="form-control"
                id="username"
                aria-describedby="emailHelp"
                name="username"
                onChange={(e) => setNev(e.target.value)}
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
                    onChange={(e) => setMegye(e.target.value)}
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
                    onChange={(e) => setIranyitoszam(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </form>

          <button
            type="button"
            className="btn btn-primary"
            onClick={createVaros}
          >
            Létrehoz
          </button>
        </div>
      </div>
    </div>
  );
};

export default Varosok;
