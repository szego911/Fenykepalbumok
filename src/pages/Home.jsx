import React, { useState } from "react";
import "./css/Main.css";
import Sidebar from "../components/Sidebar/Sidebar";
import TileList from "../components/TileList/TileList";

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    album: "",
    file: null,
    description: "",
    location: "",
  });

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleImageUploadChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleImageUploadSubmit = (e) => {
    e.preventDefault();
    uploadImage();
    handleCloseModal();
  };

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
          <div className="title d-flex justify-content-between align-items-center mb-4">
            <button
              onClick={handleOpenModal}
              className="btn btn-secondary btn-sm"
            >
              + Kép feltöltése
            </button>
            <h1 className="flex-grow-1 text-center m-0">Képek</h1>
          </div>
          <TileList />

          {/* Modal */}
          {showModal && (
            <div className="modal-backdrop">
              <div className="modal-content-small">
                <h2 className="poppins">Kép feltöltése</h2>
                <form onSubmit={handleImageUploadSubmit}>
                  <div className="form-group">
                    <label className="form-label text-start w-100 fs-5 text">
                      Kép címe:{""}
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleImageUploadChange}
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
                      onChange={handleImageUploadChange}
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
                      onChange={handleImageUploadChange}
                      className="form-control"
                      required
                    >
                      <option value="">Válassz albumot</option>
                      <option value="család">Család</option>
                      <option value="nyaralás">Nyaralás</option>
                      <option value="művészet">Művészet</option>
                      {/* dinamikusan is jöhetne backendről */}
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
                      onChange={handleImageUploadChange}
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
                      onChange={handleImageUploadChange}
                      className="form-control"
                      rows={3}
                      required
                      maxLength={150}
                    />
                  </div>

                  <div className="d-flex justify-content-between mt-3">
                    <button type="submit" className="btn btn-primary">
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
        </div>
      </div>
    </div>
  );
};

export default Home;
