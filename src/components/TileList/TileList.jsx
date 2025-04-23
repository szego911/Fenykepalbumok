import React, { useState, useEffect } from "react";
import "./TileList.css";
import Tile from "../Tile/Tile";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function TileList() {
  const [tiles, setTiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    try {
      fetch("http://localhost:4000/api/allImages", requestOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setTiles(data);
            setIsLoading(false);
          }
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.err(error);
    }
  }, []);

  return (
    <div className="tile-list">
      {!isLoading ? (
        tiles.map((tile) => (
          <Tile
            kep_id={tile.KEP_ID}
            felhasznalo_id={tile.FELHASZNALO_ID}
            album_id={tile.ALBUM_ID}
            cim={tile.CIM}
            leiras={tile.LEIRAS}
            feltoltes_datum={tile.FELTOLTES_DATUM}
            helyszin_varos_id={tile.HELYSZIN_VAROS_ID}
            kep={tile.KEP}
          />
        ))
      ) : (
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      )}
    </div>
  );
}

export default TileList;
