import React from "react";
import "./Sidebar.css";
import { NavLink } from "react-router";
import { MdCancel } from "react-icons/md";

const Sidebar = () => {
  function toggleMenu() {
    document.querySelector(".menu-toggle").classList.toggle("d-n");
    document.querySelector(".sidebar").classList.toggle("is-active");
    document.querySelector(".cancel-sidebar").classList.toggle("d-n");
  }
  function closeMenu() {
    document.querySelector(".menu-toggle").classList.toggle("d-n");
    document.querySelector(".sidebar").classList.toggle("is-active");
    document.querySelector(".cancel-sidebar").classList.toggle("d-n");
  }
  function activeManu() {}
  return (
    <div className="sidebar position-fixed">
      <div onClick={toggleMenu} className="menu-toggle">
        <div className="hamburger">
          <span></span>
        </div>
      </div>
      <div onClick={closeMenu} className="cancel-sidebar">
        <MdCancel size={50} />
      </div>
      <h3>Fotók</h3>

      <nav className="menu">
        <NavLink
          exact="true"
          activeclassname="active"
          className="menu-item"
          to="/"
        >
          Főoldal
        </NavLink>
        <NavLink
          exact="true"
          activeclassname="active"
          className="menu-item"
          to="/profil"
        >
          Profil
        </NavLink>
        <NavLink
          exact="true"
          activeclassname="active"
          className="menu-item"
          to="/best_images"
        >
          Legjobbak
        </NavLink>
        <NavLink
          exact="true"
          activeclassname="active"
          className="menu-item"
          to="/best_images"
        >
          Kategóriák
        </NavLink>
        <NavLink
          exact="true"
          activeclassname="active"
          className="menu-item"
          to="/login"
        >
          Bejelentkezés
        </NavLink>
        <NavLink
          exact="true"
          activeclassname="active"
          className="menu-item"
          to="/register"
        >
          Regisztráció
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
