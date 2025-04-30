import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "./Profil.css";
import "../../pages/css/Main.css";
import Sidebar from "../Sidebar/Sidebar";
import { useAuth } from "../../hooks/useAuth";

const Profil = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

  const [uname, setUname] = useState(user?.nev || "");
  const [email, setEmail] = useState(user?.email || "");
  const [city, setCity] = useState(user?.city || "");
  const regdate = user?.reg_datum || "";
  const [cities, setCities] = useState([]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    nev: uname,
    email: email,
    city: city,
  });

  useEffect(() => {
    fetch("http://localhost:4000/api/varosok")
      .then((res) => res.json())
      .then((data) => setCities(data))
      .catch((err) => console.error("Városok betöltési hiba:", err));
  }, []);

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

  const handleDeleteProfile = async () => {
    const confirmed = window.confirm(
      "Biztosan törölni szeretnéd a profilodat? Ez nem visszavonható."
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:4000/api/delete/felhasznalo/${user.id}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        alert("✅ Fiók törölve");
        localStorage.removeItem("userData");
        navigate("/");
      } else {
        alert("Hiba történt a törlés során.");
      }
    } catch (error) {
      console.error("Törlési hiba:", error);
      alert("Szerverhiba a törlés során.");
    }
  };

  return (
    <div className="d-flex vh-100 custom-bg">
      <Sidebar />
      <div className="profil shadow d-flex flex-column align-items-center py-3">
        <img
          src="./anonym-picture.png"
          alt="profilkép"
          className="rounded-circle mb-1"
          style={{ width: "100px", height: "100px", objectFit: "cover" }}
        />

        <label
          htmlFor="real-file-input"
          className="btn btn-secondary btn-sm custom-file-upload mb-2 rounded-pill px-4"
        >
          Új profilkép feltöltése
        </label>
        <input
          type="file"
          id="real-file-input"
          name="myImage"
          accept="image/png, image/gif, image/jpeg"
          style={{ display: "none" }}
        />

        <div className="w-100 px-4 py-3" style={{ maxWidth: "500px" }}>
          <div className="mb-3">
            <label className="form-label fw-bold">Felhasználónév</label>
            <div className="form-control bg-light">{uname}</div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Email-cím</label>
            <div className="form-control bg-light">{email}</div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Lakhely</label>
            <div className="form-control bg-light">{city}</div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Regisztráció dátuma</label>
            <div className="form-control bg-light">
              {formatDateToYMD(regdate)}
            </div>
          </div>

          <div className="d-flex gap-3 justify-content-center">
            <button onClick={logOut} className="btn btn-primary">
              Kijelentkezés
            </button>
            <button
              className="btn btn-warning"
              onClick={() => setShowEditModal(true)}
            >
              Profil módosítása
            </button>
            <button className="btn btn-danger" onClick={handleDeleteProfile}>
              Profil törlése
            </button>
          </div>
        </div>
      </div>

      {showEditModal && (
        <div className="modal-backdrop">
          <div className="modal-content-small">
            <h2 className="poppins">Profil módosítása</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const response = await fetch(
                    `http://localhost:4000/api/update/felhasznalo/${user.id}`,
                    {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(editData),
                    }
                  );

                  const data = await response.json();

                  if (response.ok && data.success) {
                    localStorage.setItem("userData", JSON.stringify(data.user));
                    setUname(data.user.nev);
                    setEmail(data.user.email);
                    setCity(data.user.city);
                    setShowEditModal(false);
                    alert("✅ Profil sikeresen frissítve!");
                  } else {
                    alert(data.message || "Hiba történt a mentés során.");
                  }
                } catch (error) {
                  console.error("Frissítési hiba:", error);
                  alert("Hiba történt a kérés feldolgozása közben.");
                }
              }}
            >
              <div className="form-group">
                <label className="form-label text-start w-100 fs-5 text">
                  Felhasználónév
                  <input
                    type="text"
                    className="form-control"
                    value={editData.nev}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, nev: e.target.value }))
                    }
                    required
                  />
                </label>
              </div>

              <div className="form-group">
                <label className="form-label text-start w-100 fs-5 text">
                  Email
                  <input
                    type="email"
                    className="form-control"
                    value={editData.email}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </label>
              </div>

              <div className="form-group">
                <label className="form-label text-start w-100 fs-5 text">
                  Város azonosító
                  <select
                    className="form-control"
                    value={editData.city}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        city: e.target.value, // városnév
                      }))
                    }
                    required
                  >
                    <option value="">Válassz várost</option>
                    {cities.map((city) => (
                      <option key={city.VAROS_ID} value={city.NEV}>
                        {city.NEV}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="d-flex justify-content-between mt-3">
                <button type="submit" className="btn btn-info">
                  Mentés
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Mégsem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profil;
