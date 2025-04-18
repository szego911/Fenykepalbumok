import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import "./Tile.css";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";

function Tile({ title, thumbnail, description, id, createdBy }) {
  const navigate = useNavigate();

  if (thumbnail == "Borito" || thumbnail.length == 0) {
    thumbnail =
      "https://www.shutterstock.com/image-vector/default-image-icon-vector-missing-600nw-2079504220.jpg";
  }

  return (
    <div className="tile" key={id}>
      <Card sx={{ minHeight: "250px", width: 280 }}>
        <CardCover>
          <img
            src="https://images.unsplash.com/photo-1542773998-9325f0a098d7?auto=format&fit=crop&w=320"
            srcSet="https://images.unsplash.com/photo-1542773998-9325f0a098d7?auto=format&fit=crop&w=320&dpr=2 2x"
            loading="lazy"
            alt=""
          />
        </CardCover>
        <CardCover
          sx={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)",
          }}
        />
        <CardContent sx={{ justifyContent: "flex-end" }}>
          <Typography level="title-lg" textColor="#fff">
            Yosemite National Park
          </Typography>
          <Typography
            startDecorator={<LocationOnRoundedIcon />}
            textColor="neutral.300"
          >
            California, USA
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default Tile;
