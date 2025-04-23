import React, { useState, useEffect } from "react";
import "./TileList.css";
import Tile from "../Tile/Tile";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function TileList() {
  const [tiles, setTiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchTiles();
  }, []);

  const fetchTiles = () => {
    fetch("http://localhost:4000/api/allImages")
      .then((response) => response.json())
      .then((result) => {
        setTiles(result);
        setIsLoading(false);
      })
      .catch((error) => console.error(error));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:4000/api/delete/kep/${id}`, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          setTiles((prevTiles) => prevTiles.filter((tile) => tile.KEP_ID !== id));
        } else {
          console.error("Hiba történt a törlés során");
        }
      })
      .catch((error) => console.error(error));
  };

  const handleEdit = (tile) => {
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

    await fetch(`http://localhost:4000/api/updatePatch/kep/${editData.KEP_ID}`, {
      method: "PATCH",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setEditModal(false);
        fetchTiles();
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="tile-list">
      {!isLoading ? (
        tiles.map((tile) => (
          <Tile
            key={tile.KEP_ID}
            kep_id={tile.KEP_ID}
            felhasznalo_id={tile.FELHASZNALO_ID}
            album_id={tile.ALBUM_ID}
            cim={tile.CIM}
            leiras={tile.LEIRAS}
            feltoltes_datum={tile.FELTOLTES_DATUM}
            helyszin_varos_id={tile.HELYSZIN_VAROS_ID}
            kep={tile.KEP}
            onEdit={() => handleEdit(tile)}
            onDelete={handleDelete}
          />
        ))
      ) : (
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      )}

      {/* Módosítási modal */}
      {editModal && (
        <div className="modal-backdrop">
          <div className="modal-content-small">
            <h2 className="poppins">Kép módosítása</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Kép címe:
                  <input
                    type="text"
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
                <label>Leírás:
                  <textarea
                    value={editData.LEIRAS}
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, LEIRAS: e.target.value }))
                    }
                    className="form-control"
                    rows={3}
                    required
                  />
                </label>
              </div>
              <div className="form-group">
                <label>Helyszín azonosító:
                  <input
                    type="text"
                    value={editData.HELYSZIN_VAROS_ID}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        HELYSZIN_VAROS_ID: e.target.value,
                      }))
                    }
                    className="form-control"
                    required
                  />
                </label>
              </div>
              <div className="form-group">
                <label>Új kép (opcionális):
                  <input
                    type="file"
                    onChange={(e) =>
                      setEditData((prev) => ({ ...prev, KEP: e.target.files[0] }))
                    }
                    className="form-control"
                  />
                </label>
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
    </div>
  );
}

export default TileList;
