import React, { useState, useEffect } from "react";
import Tile from "../Tile/Tile";

function CategoryList({ images }) {
  const [tiles, setTiles] = useState(() => {
    const stored = localStorage.getItem("images");
    return stored ? JSON.parse(stored) : [];
  });
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    setTiles(images);
  }, [images]);

  const executeDelete = () => {
    if (!deleteId) return;

    fetch(`http://localhost:4000/api/delete/kep/${deleteId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          const updatedTiles = tiles.filter((tile) => tile.KEP_ID !== deleteId);
          setTiles(updatedTiles);
          localStorage.removeItem("images");
          localStorage.setItem("images", JSON.stringify(updatedTiles));
        } else {
          console.error("Hiba történt a törlés során");
        }
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setDeleteModal(false);
        setDeleteId(null);
      });
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setDeleteModal(true);
  };

  const handleEdit = (id) => {
    const tile = tiles.find((t) => t.KEP_ID === id);
    setEditData(tile);
    setEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("felhasznalo_id", editData.FELHASZNALO_ID);
    formData.append("album_id", editData.ALBUM_ID);
    formData.append("cim", editData.CIM);
    formData.append("leiras", editData.LEIRAS);
    formData.append("helyszin_varos_id", editData.HELYSZIN_VAROS_ID);
    if (editData.KEP) {
      formData.append("kep", editData.KEP);
    }

    try {
      const response = await fetch(
        `http://localhost:4000/api/updatePatch/kep/${editData.KEP_ID}`,
        {
          method: "PATCH",
          body: formData,
        }
      );
      const result = await response.json();
      console.log(result);

      setEditModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="tile-list">
      {tiles.length === 0 ? (
        <h2>Nincs ilyen kép</h2>
      ) : (
        tiles.map((tile) => (
          <Tile
            key={tile.KEP_ID}
            kep_id={tile.KEP_ID}
            album_title={tile.ALBUM_NEV}
            cim={tile.CIM}
            varos={tile.VAROS_NEV}
            kep={tile.KEP}
            onEdit={handleEdit}
            onDelete={confirmDelete}
          />
        ))
      )}

      {editModal && editData && (
        <div className="modal-backdrop">
          <div className="modal-content-small">
            <h2 className="poppins">Kép módosítása</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label className="form-label text-start w-100 fs-5 text">
                  Cím
                  <input
                    type="text"
                    name="cim"
                    value={editData.CIM}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, CIM: e.target.value }))
                    }
                    className="form-control"
                    required
                  />
                </label>
              </div>

              <div className="form-group">
                <label className="form-label text-start w-100 fs-5 text">
                  Rövid leírás
                  <textarea
                    name="leiras"
                    value={editData.LEIRAS}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        LEIRAS: e.target.value,
                      }))
                    }
                    className="form-control"
                    rows={3}
                    maxLength={150}
                    required
                  />
                </label>
              </div>

              <div className="form-group">
                <label className="form-label text-start w-100 fs-5 text">
                  Új kép feltöltése (nem kötelező)
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        KEP: e.target.files[0],
                      }))
                    }
                  />
                </label>
              </div>

              <div className="d-flex justify-content-between mt-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditModal(false)}
                >
                  Mégsem
                </button>
                <button type="submit" className="btn btn-info">
                  Mentés
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {deleteModal && (
        <div className="modal-backdrop">
          <div className="modal-content-small">
            <h4 className="poppins mb-3">
              Biztosan törölni szeretnéd ezt a képet?
            </h4>
            <div className="d-flex justify-content-between">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setDeleteModal(false);
                  setDeleteId(null);
                }}
              >
                Mégsem
              </button>
              <button className="btn btn-danger" onClick={executeDelete}>
                Törlés
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryList;
