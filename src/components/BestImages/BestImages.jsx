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
            <h1 className="flex-grow-1 text-center m-0">Legjobbak</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestImages;
