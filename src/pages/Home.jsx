import React from "react";
import "./css/Main.css";
import Sidebar from "../components/Sidebar/Sidebar";
import TileList from "../components/TileList/TileList";
import WaitlistList from "../components/WaitlistList/WaitlistList";

const Home = () => {
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

          <TileList />

          

          
        </div>
      </div>
    </div>
  );
};

export default Home;
