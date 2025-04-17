import React from "react";
import "./css/Main.css";
import Sidebar from "../components/Sidebar/Sidebar";
import TileList from "../components/TileList/TileList";
import WaitlistList from "../components/WaitlistList/WaitlistList";

const Home = () => {
  return (
    <div className="home-page d-flex vh-100 custom-bg">
      <Sidebar />
      <div className="content">
        <div className="home">
          <div className="title d-flex justify-content-between align-items-center mb-4">
            <label
              for="real-file-input"
              class="btn btn-secondary btn-sm custom-file-upload"
            >
              + Kép feltöltése
            </label>
            <input
              type="file"
              id="real-file-input"
              name="myImage"
              accept="image/png, image/gif, image/jpeg"
            />
            <h1 className="flex-grow-1 text-center m-0">Képek</h1>
          </div>
          <TileList />
        </div>
      </div>
    </div>
  );
};

export default Home;
