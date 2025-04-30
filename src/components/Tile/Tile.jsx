import React, { useState } from "react";
import "./Tile.css";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

function Tile({ kep_id, cim, kep, onEdit, onDelete, onClick }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="tile" key={kep_id}>
      <Card
        sx={{
          minHeight: "250px",
          width: 280,
          position: "relative",
        }}
      >
        <CardCover onClick={onClick}>
          <img src={`data:image/jpeg;base64,${kep}`} loading="lazy" alt="" />
        </CardCover>
        <CardCover
          sx={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)",
          }}
        />
        <CardContent sx={{ justifyContent: "flex-end" }}>
          {/* Menü gomb animációval */}
          <IconButton
            aria-label="options"
            onClick={handleMenuOpen}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "white",
              backgroundColor: "rgba(0,0,0,0.4)",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
            }}
            className={menuOpen ? "rotating-icon" : ""}
          >
            <MoreVertIcon />
          </IconButton>

          {/* Menü popup */}
          <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose}>
            <MenuItem
              onClick={() => {
                onEdit(kep_id);
                handleMenuClose();
              }}
            >
              ✏️ Módosítás
            </MenuItem>
            <MenuItem
              onClick={() => {
                onDelete(kep_id);
                handleMenuClose();
              }}
            >
              🗑️ Törlés
            </MenuItem>
          </Menu>

          {/* Szövegek */}
          <Typography level="title-lg" textColor="#fff">
            {cim}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default Tile;
