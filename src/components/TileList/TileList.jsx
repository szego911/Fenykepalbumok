import React from "react";
import "./TileList.css";
import Tile from "../Tile/Tile";

import { useState, useEffect } from "react";
import "./TileList.css";

function TileList() {
  const [tiles, setTiles] = useState([
    {
      id: 1,
      title: "Kép",
      thumbnail: "Borito",
      description: "Leiras",
      createdBy: "Keszitette",
    },
    {
      id: 2,
      title: "Kép2",
      thumbnail: "Borito",
      description: "Leiras",
      createdBy: "Keszitette",
    },
    {
      id: 3,
      title: "Kép3",
      thumbnail: "Borito",
      description: "Leiras",
      createdBy: "Keszitette",
    },
    {
      id: 4,
      title: "Kép",
      thumbnail: "Borito",
      description: "Leiras",
      createdBy: "Keszitette",
    },
    {
      id: 5,
      title: "Kép2",
      thumbnail: "Borito",
      description: "Leiras",
      createdBy: "Keszitette",
    },
    {
      id: 6,
      title: "Kép3",
      thumbnail: "Borito",
      description: "Leiras",
      createdBy: "Keszitette",
    },
    {
      id: 7,
      title: "Kép",
      thumbnail: "Borito",
      description: "Leiras",
      createdBy: "Keszitette",
    },
    {
      id: 8,
      title: "Kép2",
      thumbnail: "Borito",
      description: "Leiras",
      createdBy: "Keszitette",
    },
    {
      id: 9,
      title: "Kép3",
      thumbnail: "Borito",
      description: "Leiras",
      createdBy: "Keszitette",
    },
  ]);


  /*useEffect(() => {
    fetch(window._env_.BACKEND_URL + "/presentation/list")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setTiles(data.presentations);
        } else {
          throw new Error("Server returned unsuccessful response");
        }
      })
      .catch((error) => {
        console.error("Error fetching tiles:", error);
        setTiles([]);
      });
  }, []);*/
  return (
    <div className="tile-list">
      {tiles.map((tile) => (
        <Tile
          id={tile.id}
          title={tile.title}
          thumbnail={tile.thumbnail}
          description={tile.description}
          createdBy={tile.createdBy}
        />
      ))}
    </div>
  );
}

export default TileList;
