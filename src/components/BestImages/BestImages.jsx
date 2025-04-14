import React from "react";
import "./BestImages.css";
import Sidebar from "../Sidebar/Sidebar";


const BestImages = () => {
  return (
    <div className="home-page d-flex">
      <Sidebar />
      <div className="content">
        <div className="home">
          <div className="title d-flex justify-content-between align-items-center mb-4">
            <a
              className="btn btn-secondary btn-sm"
              role="button"
              aria-pressed="true"
              href=""
            >
              Kép feltöltése
            </a>
            <h1 className="flex-grow-1 text-center m-0">Képek</h1>
          </div>

       

          <h1 className="flex-grow-1 text-center m-3">Reactions</h1>

          
          
        </div>
      </div>
    </div>
  );
};

export default BestImages;
