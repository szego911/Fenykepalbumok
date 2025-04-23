import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import "./Tile.css";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";

function Tile({
  kep_id,
  felhasznalo_id,
  album_id,
  cim,
  leiras,
  feltoltes_datum,
  helyszin_varos_id,
  kep,
  onEdit,
  onDelete,
}) {
  //const navigate = useNavigate();

  return (
    <div className="tile" key={kep_id}>
      <Card
        sx={{
          minHeight: "250px",
          width: 280,
        }}
      >
        <CardCover>
          <img src={`data:image/jpeg;base64,${kep}`} loading="lazy" alt="" />
        </CardCover>
        <CardCover
          sx={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)",
          }}
        />
        <CardContent sx={{ justifyContent: "flex-end" }}>
          <Typography level="title-lg" textColor="#fff">
            {cim}
          </Typography>
          <Typography
            startDecorator={<LocationOnRoundedIcon />}
            textColor="neutral.300"
          >
            {helyszin_varos_id}
          </Typography>
          <Typography textColor="#fff">{leiras}</Typography>
          <Typography textColor="#fff">Album: {album_id}</Typography>
          <div className="tile-actions">
            <button
              className="btn btn-warning btn-sm"
              onClick={() => onEdit(kep_id)}
            >
              Módosítás
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(kep_id)}
            >
              Törlés
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Tile;
