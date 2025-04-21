import React, { useState } from "react";
import "./css/Main.css";
import Sidebar from "../components/Sidebar/Sidebar";
import TileList from "../components/TileList/TileList";
import WaitlistList from "../components/WaitlistList/WaitlistList";

const Home = () => {
  // --- Kép feltöltés modal állapotai ---
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    album: "",
    file: null,
    description: "",
    location: "",
  });

  // --- Album létrehozás modal állapotai ---
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [albumData, setAlbumData] = useState({
    name: "",
    description: "",
  });

  // --- Modalok nyitása/zárása ---
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleOpenAlbumModal = () => setShowAlbumModal(true);
  const handleCloseAlbumModal = () => setShowAlbumModal(false);

  // --- Form kezelők ---
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value, // fájl esetén a fájlobjektumot menti, egyébként a szöveges értéket
    }));
  };

  // --- Album űrlap mezőinek kezelése ---
  const handleAlbumChange = (e) => {
    const { name, value } = e.target;
    setAlbumData((prev) => ({
      ...prev,
      [name]: value, // albumnév és leírás frissítése
    }));
  };

  // --- Képfeltöltés űrlap beküldése ---
  const handleSubmit = (e) => {
    e.preventDefault();
    uploadImage(); // Kép küldése backendre
    console.log("Feltöltendő adat:", formData);
    handleCloseModal(); // Modal bezárása feltöltés után
  };

  // --- Album űrlap beküldése ---
  const handleAlbumSubmit = (e) => {
    e.preventDefault();
    console.log("Új album adatai:", albumData);
    handleCloseAlbumModal(); // Modal bezárása feltöltés után
  };

  // --- Kép feltöltése a backendre (POST kérés FormData-val) ---
  const uploadImage = async () => {
    const formdata = new FormData();
    formdata.append("felhasznalo_id", "1");
    formdata.append("album_id", "1");
    formdata.append("cim", formData.title);
    formdata.append("leiras", formData.description);
    formdata.append("helyszin_varos_id", formData.location);
    formdata.append("kep", formData.file);

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    await fetch("http://localhost:4000/api/upload/image", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };

  return (
    <div className="home-page d-flex vh-100 custom-bg">
      <Sidebar />
      <div className="content">
        <div className="home">
          <div className="title d-flex justify-content-between align-items-center m-4">
            <button
              onClick={handleOpenModal}
              className="btn btn-success btn-sm mr-4"
            >
              + Kép feltöltése
            </button>
            <button
              onClick={handleOpenAlbumModal}
              className="btn btn-info btn-sm"
            >
              + Album létrehozása
            </button>
            <h1 className="flex-grow-1 text-center m-0">Képek</h1>
          </div>
          <TileList />

          {/* Képfeltöltés Modal */}
          {showModal && (
            <div className="modal-backdrop">
              <div className="modal-content-small">
                <h2 className="poppins">Kép feltöltése</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label text-start w-100 fs-5 text">
                      Kép címe:{""}
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label text-start w-100 fs-5 text">
                      Helyszín:{""}
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label text-start w-100 fs-5 text">
                      Albumhoz hozzáadás:{""}
                    </label>
                    <select
                      name="album"
                      value={formData.album}
                      onChange={handleChange}
                      className="form-control"
                      required
                    >
                      <option value="">Válassz albumot</option>
                      <option value="család">Család</option>
                      <option value="nyaralás">Nyaralás</option>
                      <option value="művészet">Művészet</option>
                      {/* Itt kérjük majd le az AB-ból a friss adatokat */}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label text-start w-100 fs-5 text">
                      Kép feltöltése:
                    </label>
                    <input
                      type="file"
                      name="file"
                      accept="image/*"
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label text-start w-100 fs-5 text">
                      Rövid leírás
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="form-control"
                      rows={3}
                      required
                      maxLength={150}
                    />
                  </div>

                  <div className="d-flex justify-content-between mt-3">
                    <button type="submit" className="btn btn-success">
                      Feltöltés
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCloseModal}
                    >
                      Mégsem
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Album létrehozás Modal */}
          {showAlbumModal && (
            <div className="modal-backdrop">
              <div className="modal-content-small">
                <h2 className="poppins">Új album létrehozása</h2>
                <form onSubmit={handleAlbumSubmit}>
                  <div className="form-group">
                    <label className="form-label text-start w-100 fs-5 text">
                      Album neve
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={albumData.name}
                      onChange={handleAlbumChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label text-start w-100 fs-5 text">
                      Rövid leírás
                    </label>
                    <textarea
                      name="description"
                      value={albumData.description}
                      onChange={handleAlbumChange}
                      className="form-control"
                      rows={3}
                      maxLength={150}
                      required
                    />
                  </div>

                  <div className="d-flex justify-content-between mt-3">
                    <button type="submit" className="btn btn-info">
                      Létrehozás
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCloseAlbumModal}
                    >
                      Mégsem
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
