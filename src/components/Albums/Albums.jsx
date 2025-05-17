import React, { useState, useEffect } from "react";
import "./Albums.css";
import { Link } from "react-router";
import Sidebar from "../Sidebar/Sidebar";
import { useAuth } from "../../hooks/useAuth";

const Albums = () => {
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const { isLoggedIn, isAdmin, user } = useAuth();

  const fetchAlbums = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/get/albumok");
      const result = await response.json();
      setAlbums(result);
      setIsLoading(false);
    } catch (error) {
      console.error("Hiba az albumok lekérdezésekor:", error);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="d-flex vh-100 custom-bg">
        <Sidebar />
        <div className="profil notLoggedin  mx-auto d-flex justify-content-center align-items-center shadow">
          Kérlek jelentkezz be{" "}
          <Link href="/login">
            <span className="text-primary underline-on-hover">itt</span>
          </Link>
          , hogy használni tudd!
        </div>
      </div>
    );
  }

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/delete/album/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("Backend hiba:", error);
        return;
      }

      const result = await response.json();
      console.log(result);
      setAlbums((prevAlbums) =>
        prevAlbums.filter((album) => album.ALBUM_ID !== id)
      );
    } catch (error) {
      console.error("Hiba az album törlésekor:", error);
    }
  };

  const handleEdit = (album) => {
    setEditData(album);
    setEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const updateData = {
      nev: editData.NEV,
      leiras: editData.LEIRAS,
    };

    try {
      const response = await fetch(
        `http://localhost:4000/api/update/album/${editData.ALBUM_ID}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("Backend hiba:", error);
        return;
      }

      const result = await response.json();
      console.log(result);
      setEditModal(false);
      fetchAlbums();
    } catch (error) {
      console.error("Hiba az album módosítása során:", error);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/api/create/album", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nev: formData.name,
          leiras: formData.description,
          id: user.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Backend hiba:", error);
        return;
      }

      const result = await response.json();
      console.log(result);
      setAddModal(false);
      fetchAlbums();
    } catch (error) {
      console.error("Hiba az album létrehozása során:", error);
    }
  };

  return (
    <div className="d-flex vh-50  bg-white">
      <div className="albums-page">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Albumok</h1>
          <button className="btn btn-success" onClick={() => setAddModal(true)}>
            + Új album
          </button>
        </div>

        {isLoading ? (
          <p>Betöltés...</p>
        ) : (
          <div className="albums-list">
            {albums.map((album) => (
              <div key={album.id} className="album-item">
                <h3>{album.nev}</h3>
                <p>{album.leiras}</p>
                {isAdmin ? (
                  <div className="album-actions">
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEdit(album)}
                    >
                      Módosítás
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(album.ALBUM_ID)}
                    >
                      Törlés
                    </button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            ))}
          </div>
        )}

        {editModal && (
          <div className="modal-backdrop">
            <div className="modal-content-small">
              <h2>Album módosítása</h2>
              <form onSubmit={handleEditSubmit}>
                <div className="form-group">
                  <label>Album neve:</label>
                  <input
                    type="text"
                    value={editData.NEV}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, NEV: e.target.value }))
                    }
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Leírás:</label>
                  <textarea
                    value={editData.LEIRAS}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        LEIRAS: e.target.value,
                      }))
                    }
                    className="form-control"
                    rows={3}
                    required
                  />
                </div>
                <div className="d-flex justify-content-between mt-3">
                  <button type="submit" className="btn btn-success">
                    Mentés
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditModal(false)}
                  >
                    Mégsem
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {addModal && (
          <div className="modal-backdrop">
            <div className="modal-content-small">
              <h2>Új album létrehozása</h2>
              <form onSubmit={handleAddSubmit}>
                <div className="form-group">
                  <label>
                    Album neve:
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="form-control"
                      required
                    />
                  </label>
                </div>
                <div className="form-group">
                  <label>
                    Leírás:
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      className="form-control"
                      rows={3}
                      required
                    />
                  </label>
                </div>
                <div className="d-flex justify-content-between mt-3">
                  <button type="submit" className="btn btn-success">
                    Létrehozás
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setAddModal(false)}
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
  );
};

export default Albums;
