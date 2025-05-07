import React, { useState, useEffect } from "react";
import "./BestImages.css";
import Sidebar from "../Sidebar/Sidebar";
import CustomList from "./CustomList";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { BiSolidCommentError } from "react-icons/bi";

const BestImages = () => {
  const [bestImages, setBestImages] = useState(() => {
    const stored = localStorage.getItem("bestImages");
    return stored ? JSON.parse(stored) : [];
  });
  const [cityImages, setCityImages] = useState(() => {
    const stored = localStorage.getItem("cityImages");
    return stored ? JSON.parse(stored) : [];
  });
  const [selectedCityId, setSelectedCityId] = useState("2");

  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(true);

  const [users, setUsers] = useState(() => {
    const stored = localStorage.getItem("users");
    return stored ? JSON.parse(stored) : [];
  });
  const [loading3, setLoading3] = useState(true);
  const [error, setError] = useState(null);

  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/varosok")
      .then((res) => res.json())
      .then((data) => setCities(data))
      .catch((err) => console.error("Városok betöltése sikertelen:", err));
  }, []);

  useEffect(() => {
    if (bestImages.length > 0) {
      setIsLoading(false);
    }
    if (cityImages.length > 0) {
      setIsLoading2(false);
    }
    if (users.length > 0) {
      setLoading3(false);
    }
    //fetchBestImages();
    fetchCityImages(selectedCityId);
    fetchTopUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBestImages = () => {
    fetch("http://localhost:4000/api/topCommentedImages")
      .then((response) => response.json())
      .then((result) => {
        setBestImages(result);
        localStorage.removeItem("bestImages");
        localStorage.setItem("bestImages", JSON.stringify(result));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Server error:", error);
        setIsLoading(false);
      });
  };

  const fetchCityImages = (cityID) => {
    fetch("http://localhost:4000/api/imagesWithCommentsFromCity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cityId: cityID }),
    })
      .then((response) => response.json())
      .then((result) => {
        setCityImages(result);
        localStorage.removeItem("cityImages");
        localStorage.setItem("cityImages", JSON.stringify(result));
        setIsLoading2(false);
      })
      .catch((error) => {
        console.error("Server error:", error);
        setIsLoading2(false);
      });
  };

  const fetchTopUser = () => {
    fetch("http://localhost:4000/api/usersWithAvgRatingOver2")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        localStorage.removeItem("users");
        localStorage.setItem("users", JSON.stringify(data));
        setLoading3(false);
      })
      .catch((err) => {
        console.error("Hiba a felhasználók lekérdezésekor:", err);
        setError(err);
        setLoading3(false);
      });
  };

  if (error) {
    return <div>Hiba : {error}</div>;
  }

  const refreshCity = (e) => {
    const { value } = e.target;
    setIsLoading2(true);
    localStorage.removeItem("cityImages");
    setSelectedCityId(value);
    fetchCityImages(value);
  };

  return (
    <div className="home-page d-flex vh-100 custom-bg">
      <Sidebar />
      <div className="content">
        <div className="home">
          <div className="title d-flex justify-content-between align-items-center m-4">
            <h1 className="flex-grow-1 text-center m-0">Érdekességek</h1>
          </div>
          <div className="">
            <h2 className="flex-grow-1 text-center mb-3">Legjobb képek</h2>
            {isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  width: "70vw",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  margin: "auto",
                }}
              >
                <CircularProgress />
                <p>Betöltés...</p>
              </Box>
            ) : (
              <CustomList images={bestImages} />
            )}
          </div>
          <div className="">
            <h2 className="flex-grow-1 text-center mb-3">Város képei</h2>
            <div className="form-group">
              <label className="form-label text-start w-25">
                Város:
                <select
                  name="city"
                  value={selectedCityId}
                  onChange={refreshCity}
                  className="form-control"
                  required
                >
                  <option value="2" disabled>
                    Budapest
                  </option>
                  {cities.map((city, index) => (
                    <option key={city.VAROS_ID || index} value={city.VAROS_ID}>
                      {city.NEV}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {isLoading2 ? (
              <Box
                sx={{
                  display: "flex",
                  width: "70vw",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                  margin: "auto",
                }}
              >
                <CircularProgress />
                <p>Betöltés...</p>
              </Box>
            ) : (
              <CustomList images={cityImages} />
            )}
          </div>
          <div className="rating-users p-3">
            <h2>2 feletti értékelésű felhasználók</h2>
            {loading3 ? (
              <p>Betöltés...</p>
            ) : users.length === 0 ? (
              <p>Nincs találat.</p>
            ) : (
              <ul>
                {users.map((user, index) => (
                  <li key={index}>
                    <strong>{user.FELHASZNALONEV}</strong>:{" "}
                    {user.ATLAG_ERTEKELES}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestImages;
