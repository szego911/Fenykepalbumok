import React, { useState, useEffect } from "react";
import "./BestImages.css";
import Sidebar from "../Sidebar/Sidebar";
import CustomList from "./CustomList";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const BestImages = () => {
  const [bestImages, setBestImages] = useState(() => {
    const stored = localStorage.getItem("bestImages");
    return stored ? JSON.parse(stored) : [];
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (bestImages.length > 0) {
      setIsLoading(false);
    }
    fetchBestImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBestImages = () => {
    fetch("http://localhost:4000/api/topCommentedImages")
      .then((response) => response.json())
      .then((result) => {
        setBestImages(result);
        localStorage.removeItem("bestImages");
        localStorage.setItem("bestImages", JSON.stringify(result));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Server error:", error);
        setIsLoading(false);
      });
  };
  return (
    <div className="home-page d-flex vh-100 custom-bg">
      <Sidebar />
      <div className="content">
        <div className="home">
          <div className="title d-flex justify-content-between align-items-center m-4">
            <h1 className="flex-grow-1 text-center m-0">Legjobbak</h1>
          </div>
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
            <CustomList images={bestImages} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BestImages;
