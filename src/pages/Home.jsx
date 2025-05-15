import React, { useState, useEffect } from "react";
import "./css/Main.css";
import Sidebar from "../components/Sidebar/Sidebar";
import TileList from "../components/TileList/TileList";
import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    album: "",
    file: null,
    description: "",
    location: "",
    kategoria_id: "",
  });
  const [refreshImages, setRefreshImages] = useState(false);
  const [categories, setCategories] = useState([]);

  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [albumData, setAlbumData] = useState({
    name: "",
    description: "",
  });

  const [userAlbums, setUserAlbums] = useState([]);
  const { isLoggedIn, user } = useAuth();

  // Új state
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/get/albumok")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUserAlbums(data);
        } else {
          console.error("Invalid data format", data);
          setUserAlbums([]);
        }
      })
      .catch((error) => console.error("Albumok lekérése sikertelen:", error));
  }, []);

  useEffect(() => {
    fetch("http://localhost:4000/api/get/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error("Invalid data format", data);
          setCategories([]);
        }
      })
      .catch((error) =>
        console.error("Kategóriák lekérése sikertelen:", error)
      );
  }, []);

  // Lokális tároló frissítése, ha a hozzászólások és értékelések még nem léteznek
  const fetchCommentsAndRatings = async (kepId) => {
    // Ha már vannak az adataink a localStorage-ban, használjuk őket
    const storedComments = localStorage.getItem(`comments-${kepId}`);
    const storedRatings = localStorage.getItem(`ratings-${kepId}`);

    if (storedComments && storedRatings) {
      setComments(JSON.parse(storedComments));
      setRatings(JSON.parse(storedRatings));
      return;
    }

    // Ha még nem voltak betöltve, kérjük le őket
    try {
      const commentsRes = await fetch(
        `http://localhost:4000/api/get/hozzaszolasok?kep_id=${kepId}`
      );
      const commentsData = await commentsRes.json();
      setComments(commentsData);
      localStorage.setItem(`comments-${kepId}`, JSON.stringify(commentsData));

      const ratingsRes = await fetch(
        `http://localhost:4000/api/get/ertekelesek?kep_id=${kepId}`
      );
      const ratingsData = await ratingsRes.json();
      setRatings(ratingsData);
      localStorage.setItem(`ratings-${kepId}`, JSON.stringify(ratingsData));
    } catch (err) {
      console.error("Hozzászólások és értékelések lekérése sikertelen:", err);
    }
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleOpenAlbumModal = () => setShowAlbumModal(true);
  const handleCloseAlbumModal = () => setShowAlbumModal(false);

  const formatDate = (rawDate) => {
    const parsedDate = new Date(Date.parse(rawDate));
    return isNaN(parsedDate) ? rawDate : parsedDate.toLocaleString();
  };

  const handleFormFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      file: file,
    }));
  };

  const handleAlbumChange = (e) => {
    const { name, value } = e.target;
    setAlbumData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUploadSubmit = (e) => {
    e.preventDefault();
    uploadImage();
    handleCloseModal();
  };

  const handleAlbumSubmit = (e) => {
    e.preventDefault();
    uploadAlbum();
    handleCloseAlbumModal();
  };

  const uploadImage = async () => {
    const formdata = new FormData();
    formdata.append("felhasznalo_id", user.id);
    formdata.append("album_id", formData.album);
    formdata.append("cim", formData.title);
    formdata.append("leiras", formData.description);
    formdata.append("helyszin_varos_id", formData.location);
    formdata.append("kategoria_id", formData.kategoria_id);
    formdata.append("kep", formData.file);

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    await fetch("http://localhost:4000/api/upload/image", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        alert(result.message);
        setRefreshImages((prev) => !prev);
      })
      .catch((error) => console.error(error));
  };

  const uploadAlbum = async () => {
    const raw = JSON.stringify({
      nev: albumData.name,
      leiras: albumData.description,
      id: user.id,
    });

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:4000/api/create/album", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);

    const kepId = image.KEP_ID || image.kep_id || image.id; // több lehetőség figyelembevétele
    if (!kepId) {
      console.error(
        "Nincs érvényes kép ID a hozzászólások lekéréséhez:",
        image
      );
      return;
    }

    // Meghívjuk a lekérést, hogy ha még nem voltak betöltve, most történjen meg
    fetchCommentsAndRatings(kepId);

    setShowImageModal(true);
  };

  return (
    <div className="home-page d-flex custom-bg">
      <Sidebar />
      <div className="content">
        <div className="home">
          <div className="title d-flex justify-content-between align-items-center m-4">
            {isLoggedIn && (
              <button
                onClick={handleOpenModal}
                className="btn btn-success btn-sm mr-4"
              >
                + Kép feltöltése
              </button>
            )}
            {isLoggedIn && (
              <button
                onClick={handleOpenAlbumModal}
                className="btn btn-info btn-sm"
              >
                + Album létrehozása
              </button>
            )}
            <h1 className="flex-grow-1 text-center m-0">Képek</h1>
          </div>
          <TileList
            refreshTrigger={refreshImages}
            onImageClick={handleImageClick}
          />

          {/* Képfeltöltés Modal */}
          {showModal && (
            <div className="modal-backdrop">
              <div className="modal-content-small">
                <h2 className="poppins">Kép feltöltése</h2>
                <form onSubmit={handleImageUploadSubmit}>
                  <div className="form-group">
                    <label className="form-label text-start w-100 fs-5 text">
                      Kép címe:
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleFormFieldChange}
                        className="form-control"
                        required
                      />
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="form-label text-start w-100 fs-5 text">
                      Helyszín:
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleFormFieldChange}
                        className="form-control"
                        required
                      />
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="form-label text-start w-100 fs-5 text">
                      Albumhoz hozzáadás:
                      <select
                        name="album"
                        value={formData.album}
                        onChange={handleFormFieldChange}
                        className="form-control"
                        required
                      >
                        <option value="" disabled hidden>
                          Válassz albumot
                        </option>
                        {userAlbums.map((album, index) => (
                          <option
                            key={album.ALBUM_ID || index}
                            value={album.ALBUM_ID}
                          >
                            {album.NEV || "Névtelen album"}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="form-label text-start w-100 fs-5 text">
                      Kategória:
                      <select
                        name="kategoria_id"
                        value={formData.kategoria_id}
                        onChange={handleFormFieldChange}
                        className="form-control"
                        required
                      >
                        <option value="" disabled hidden>
                          Válassz kategóriát
                        </option>
                        {categories.map((category) => (
                          <option
                            key={category.KATEGORIA_ID}
                            value={category.KATEGORIA_ID}
                          >
                            {category.NEV}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="form-label text-start w-100 fs-5 text">
                      Kép feltöltése:
                      <input
                        type="file"
                        name="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="form-control"
                        required
                      />
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="form-label text-start w-100 fs-5 text">
                      Rövid leírás
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleFormFieldChange}
                        className="form-control"
                        rows={3}
                        required
                        maxLength={150}
                      />
                    </label>
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
                      <input
                        type="text"
                        name="name"
                        value={albumData.name}
                        onChange={handleAlbumChange}
                        className="form-control"
                        required
                      />
                    </label>
                  </div>

                  <div className="form-group">
                    <label className="form-label text-start w-100 fs-5 text">
                      Rövid leírás
                      <textarea
                        name="description"
                        value={albumData.description}
                        onChange={handleAlbumChange}
                        className="form-control"
                        rows={3}
                        maxLength={150}
                        required
                      />
                    </label>
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

          {/* Kép nagyitás és hozzászólások modal */}
          {showImageModal && selectedImage && (
            <div className="modal-backdrop">
              <div className="modal-content-medium d-flex">
                <div className="image-preview w-50 pe-3">
                  <img
                    src={`data:image/jpeg;base64,${selectedImage.KEP}`}
                    alt={selectedImage.CIM}
                    className="img-fluid"
                  />
                </div>
                <div className="comment-section w-50 ps-3 overflow-auto">
                  <h4 className="mb-3">Hozzászólások és Értékelések</h4>
                  {comments.length === 0 ? (
                    <p>Nincsenek hozzászólások.</p>
                  ) : (
                    comments.map((c, i) => (
                      <div key={i} className="mb-2 p-2 border-bottom">
                        <strong>
                          {c.FELHASZNALONEV ||
                            `Felhasználó #${c.FELHASZNALO_ID}`}
                        </strong>{" "}
                        <span className="text-muted">
                          {new Date(formatDate(c.DATUM)).toLocaleString()}
                        </span>
                        <p className="m-0">{c.TARTALOM}</p>
                      </div>
                    ))
                  )}

                  {ratings.length === 0 ? (
                    <p>Még nincs értékelés.</p>
                  ) : (
                    ratings.map((r, i) => (
                      <div key={i} className="mb-2 p-2 border-bottom">
                        <strong>
                          {r.FELHASZNALONEV ||
                            `Felhasználó #${r.FELHASZNALO_ID}`}
                        </strong>{" "}
                        <span className="text-muted">
                          {new Date(r.ERTEKELES_DATUM).toLocaleString()}
                        </span>
                        <p className="m-0">Pontszám: {r.PONTSZAM}/5</p>
                      </div>
                    ))
                  )}
                  <div className="d-flex justify-content-end mt-3">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowImageModal(false)}
                    >
                      Bezárás
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
