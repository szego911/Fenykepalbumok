import React from "react";
import "./Categories.css";
import Sidebar from "../Sidebar/Sidebar";
import CategoryList from "../CategoryList/CategoryList";

const Categories = () => {
  return (
    <div className="home-page d-flex vh-100 custom-bg">
      <Sidebar />
      <div className="content">
        <div className="home">
          <div className="title d-flex justify-content-between align-items-center m-4">
            <h1 className="flex-grow-1 text-center m-0">Kategóriák</h1>
          </div>
          {/*TODO: kategoriak szerinti szűrés van már endpoint /api/kategoriak */}
          <CategoryList /> {/*Ezt módosítsd majd*/}
        </div>
      </div>
    </div>
  );
};

export default Categories;
