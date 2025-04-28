import React, { useState, useEffect } from "react";
import "./TileList.css";
import Tile from "../Tile/Tile";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

function TileList() {
  const [tiles, setTiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [selectedTile, setSelectedTile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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
      .catch((error) => {
        console.error("Hiba a képek lekérdezésekor:", error);
        setIsLoading(false);
      });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:4000/api/delete/kep/${id}`, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          const updatedTiles = tiles.filter((tile) => tile.KEP_ID !== id);
          setTiles(updatedTiles);
        } else {
          console.error("Hiba történt a törlés során");
        }
      })
      .catch((error) => console.error(error));
  };

  const handleEdit = (id) => {
    const tile = tiles.find((t) => t.KEP_ID === id);
    setEditData(tile);
    setEditModal(true);
  };

  const handleTileClick = (tile) => {
    setSelectedTile(tile);
    setModalOpen(true);
  };

  return (
    <div className="tile-list">
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            width: "70vw",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            margin: "auto",
          }}
        >
          <CircularProgress />
          <p>Betöltés...</p>
        </Box>
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
            onDelete={handleDelete}
            onClick={() => handleTileClick(tile)}
          />
        ))
      )}

      {/* Képre kattintva kinagyított nézet */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "80vw",
            height: "80vh",
            bgcolor: "background.paper",
            margin: "auto",
            marginTop: "5vh",
            boxShadow: 24,
            p: 2,
            overflow: "hidden",
          }}
        >
          {/* Bal oldal: nagy kép */}
          <Box sx={{ flex: 1, overflow: "hidden" }}>
            {selectedTile && (
              <img
                src={`data:image/jpeg;base64,${selectedTile.KEP}`}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            )}
          </Box>

          {/* Jobb oldal: adatok fehér háttérrel */}
          <Box
            sx={{
              flex: 1,
              padding: 2,
              overflowY: "auto",
              bgcolor: "white",
            }}
          >
            {selectedTile && (
              <>
                <h2 id="modal-title">{selectedTile.CIM}</h2>
                <p>
                  <strong>Album:</strong> {selectedTile.ALBUM_NEV}
                </p>
                <p>
                  <strong>Város:</strong> {selectedTile.VAROS_NEV}
                </p>

                <h3>Hozzászólások:</h3>
                <div
                  style={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    border: "1px solid #ccc",
                    padding: "10px",
                  }}
                >
                  {/* Hozzászólások itt jöhetnének - jelenleg fix példák */}
                  <p>Ez egy minta hozzászólás.</p>
                  <p>Második komment.</p>
                  <p>Valami szöveg...</p>
                  <p>Valami szöveg 2...</p>
                  <p>És még több szöveg...</p>
                </div>
              </>
            )}
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default TileList;
