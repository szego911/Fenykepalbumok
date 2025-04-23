import React, { useState } from "react";
import "../../../pages/css/Main.css";
import Sidebar from "../../Sidebar/Sidebar";
import { useAuth } from "../../../hooks/useAuth";

const Varosok = () => {
  const [nev, setNev] = useState("");
  const [megye, setMegye] = useState("");
  const [iranyitoszam, setIranyitoszam] = useState("");
  const [createError, setCreateError] = useState("");

  const [torlendoId, setTorlendoId] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [updateId, setUpdateId] = useState("");
  const [updateNev, setUpdateNev] = useState("");
  const [updateMegye, setUpdateMegye] = useState("");
  const [updateIranyitoszam, setUpdateIranyitoszam] = useState("");
  const [updateError, setUpdateError] = useState("");

  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="d-flex vh-100 custom-bg">
        <Sidebar />


        <div className="profil shadow">
          Ez a városok kezelője, kérlek jelentkezz{" "}
          <a href="/login">
            <span className="text-primary underline-on-hover">itt</span>
          </a>
          , hogy használni tudd!

        </div>
      </div>
    );
  }

  const createVaros = () => {
    setCreateError("");

    if (!nev || !megye || !iranyitoszam) {
      setCreateError("Kérlek tölts ki minden mezőt a létrehozáshoz.");
      return;
    }

    const raw = JSON.stringify({ nev, megye, iranyitoszam });

    fetch("http://localhost:4000/api/create/varos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: raw,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Város hozzáadva");
          setNev("");
          setMegye("");
          setIranyitoszam("");
        } else {
          throw new Error(data.error || "Hiba történt!");
        }
      })
      .catch((error) => setCreateError(error.message));
  };

  const updateVaros = () => {
    setUpdateError("");

    if (!updateId || !updateNev || !updateMegye || !updateIranyitoszam) {
      setUpdateError("Kérlek tölts ki minden mezőt a módosításhoz.");
      return;
    }

    const raw = JSON.stringify({
      nev: updateNev,
      megye: updateMegye,
      iranyitoszam: updateIranyitoszam,
    });

    fetch(`http://localhost:4000/api/update/varos/${updateId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: raw,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Város sikeresen módosítva");
          setUpdateId("");
          setUpdateNev("");
          setUpdateMegye("");
          setUpdateIranyitoszam("");
        } else {
          setUpdateError(data.message || "Hiba történt a módosítás során.");
        }
      })
      .catch((error) => setUpdateError("Hiba módosításkor: " + error.message));
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
          alert("A megadott ID-vel nem található város.");
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

          {createError && (
            <div className="alert alert-danger">{createError}</div>
          )}

          <form>
            <div className="form-group">
              <label>Város neve</label>
              <input
                type="text"
                className="form-control"
                value={nev}
                onChange={(e) => setNev(e.target.value)}
              />
            </div>
            <div className="row mb-3">
              <div className="col-md-7">
                <div className="input-group input-group-sm">
                  <label className="input-group-text">Megye</label>
                  <select
                    className="form-select"
                    value={megye}
                    onChange={(e) => setMegye(e.target.value)}
                  >
                    <option value="" disabled>
                      Válassz megyét
                    </option>
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
                  <span className="input-group-text">Irányítószám</span>
                  <input
                    type="text"
                    className="form-control"
                    maxLength="4"
                    value={iranyitoszam}
                    onChange={(e) => setIranyitoszam(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </form>

          <button className="btn btn-primary" onClick={createVaros}>
            Létrehoz
          </button>

          <div className="d-flex justify-content-end mt-3">
            <button
              className="btn btn-dark ms-2"
              data-bs-toggle="modal"
              data-bs-target="#updateModal"
            >
              Módosítás
            </button>
            <button
              className="btn btn-danger ms-2"
              onClick={() => setShowModal(true)}
            >
              Törlés
            </button>
          </div>

          {/* Módosítás Modal */}
          <div className="modal fade" id="updateModal" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content rounded-4 shadow-lg">
                <div className="modal-header justify-content-center border-0">
                  <h2 className="text-center poppins">Város módosítása</h2>
                </div>
                <div className="modal-body">
                  {updateError && (
                    <div className="alert alert-danger">{updateError}</div>
                  )}
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
                    <option value="" disabled>
                      Válassz megyét
                    </option>
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
                    maxLength="4"
                    onChange={(e) => setUpdateIranyitoszam(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" data-bs-dismiss="modal">
                    Mégsem
                  </button>
                  <button className="btn btn-dark" onClick={updateVaros}>
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
