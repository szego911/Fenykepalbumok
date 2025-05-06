import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import UserList from "./UserList";
import CityList from "./CitiyList";
import Albums from "../Albums/Albums";

const Admin = () => {
  return (
    <div className="home-page d-flex vh-100 custom-bg">
      <Sidebar />
      <div className="content bg-white mx-auto">
        <UserList />
        <CityList />
        <Albums />
      </div>
    </div>
  );
};

export default Admin;
