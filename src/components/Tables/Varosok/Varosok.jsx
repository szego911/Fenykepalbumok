import React, { useState } from "react";
import { useNavigate } from "react-router";
import "../../../pages/css/Main.css";
import { Link } from "react-router";
import Sidebar from "../../Sidebar/Sidebar";

const Varosok = () => {
  const [nev, setNev] = useState("");
  const [megye, setMegye] = useState("");
  const [iranyitoszam, setIranyitoszam] = useState("");

  const [torlendoId, setTorlendoId] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [updateId, setUpdateId] = useState("");
  const [updateNev, setUpdateNev] = useState("");
  const [updateMegye, setUpdateMegye] = useState("");
  const [updateIranyitoszam, setUpdateIranyitoszam] = useState("");

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

  const updateVaros = () => {
    const raw = JSON.stringify({
      nev: updateNev,
      megye: updateMegye,
      iranyitoszam: updateIranyitoszam,
    });

    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: raw,
    };

    fetch(`http://localhost:4000/api/update/varos/${updateId}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Város sikeresen módosítva");
          setUpdateId("");
          setUpdateNev("");
          setUpdateMegye("");
          setUpdateIranyitoszam("");
        } else {
          alert(data.message || "Hiba történt");
        }
      })
      .catch((error) => console.error("Hiba módosításkor:", error));
  };

  const deleteVaros = () => {
    if (!torlendoId) {
      alert("Kérlek adj meg egy ID-t.");
      return;
    }

    fetch(`http://localhost:4000/api/delete/varos/${torlendoId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("A város sikeresen törölve.");
        } else {
          alert("A megadott id-vel egyetlen város sem rendelkezik.");
        }
      })
      .catch((error) => console.error("Hiba történt: ", error));

    setShowModal(false);
    setTorlendoId("");
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

          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-dark ms-2"
              data-bs-toggle="modal"
              data-bs-target="#updateModal"
            >
              Módosítás
            </button>

            <button
              type="button"
              className="btn btn-danger ms-2"
              onClick={() => setShowModal(true)}
            >
              Törlés
            </button>
          </div>

          {/* Módosítás Modal */}
          <div
            className="modal fade"
            id="updateModal"
            tabIndex="-1"
            aria-labelledby="updateModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content rounded-4 shadow-lg">
                <div className="modal-header justify-content-center border-0">
                  <h2 className="text-center poppins" id="updateModalLabel">
                    Város módosítása
                  </h2>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    placeholder="ID"
                    className="form-control mb-2"
                    value={updateId}
                    onChange={(e) => setUpdateId(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Új név"
                    className="form-control mb-2"
                    value={updateNev}
                    onChange={(e) => setUpdateNev(e.target.value)}
                  />
                  <select
                    className="form-select mb-2"
                    value={updateMegye}
                    onChange={(e) => setUpdateMegye(e.target.value)}
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
                  <input
                    type="text"
                    placeholder="Új irányítószám"
                    className="form-control"
                    value={updateIranyitoszam}
                    onChange={(e) => setUpdateIranyitoszam(e.target.value)}
                    maxLength="4"
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Mégsem
                  </button>
                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={updateVaros}
                  >
                    Módosítás
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Törlés Modal */}
          {showModal && (
            <div className="modal-backdrop">
              <div className="modal-content-small">
                <h2 className="text-center mb-2 poppins p-3">Város törlése</h2>
                <input
                  type="number"
                  className="form-control m-3"
                  placeholder="Add meg az ID-t"
                  value={torlendoId}
                  onChange={(e) => setTorlendoId(e.target.value)}
                />
                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-secondary me-2"
                    onClick={() => setShowModal(false)}
                  >
                    Mégsem
                  </button>
                  <button className="btn btn-danger" onClick={deleteVaros}>
                    Törlés
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Varosok;
