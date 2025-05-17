import { useState, useEffect } from "react";
import Sidebar from "../Sidebar/Sidebar";
import CustomList from "./CustomList";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Button from "@mui/joy/Button";

const BestImages = () => {
  const [bestImages, setBestImages] = useState(() => {
    const stored = localStorage.getItem("bestImages");
    return stored ? JSON.parse(stored) : [];
  });
  const [cityImages, setCityImages] = useState(() => {
    const stored = localStorage.getItem("cityImages");
    return stored ? JSON.parse(stored) : [];
  });

  const [users, setUsers] = useState(() => {
    const stored = localStorage.getItem("users");
    return stored ? JSON.parse(stored) : [];
  });

  const [usersMin3, setUsersMin3] = useState(() => {
    const stored = localStorage.getItem("usersMin3");
    return stored ? JSON.parse(stored) : [];
  });

  const [topCat, setTopCat] = useState(() => {
    const stored = localStorage.getItem("topCat");
    return stored ? JSON.parse(stored) : [];
  });

  const [commentC, setCommentC] = useState(() => {
    const stored = localStorage.getItem("commentC");
    return stored ? JSON.parse(stored) : [];
  });

  const [imgRatings, setImgRatings] = useState(() => {
    const stored = localStorage.getItem("imgRatings");
    return stored ? JSON.parse(stored) : [];
  });

  const [selectedCityId, setSelectedCityId] = useState("2");

  const [isLoading, setIsLoading] = useState(true);
  const [isLoading2, setIsLoading2] = useState(true);
  const [loading3, setLoading3] = useState(true);
  const [loading4, setLoading4] = useState(true);
  const [loading5, setLoading5] = useState(true);
  const [loading6, setLoading6] = useState(true);
  const [loading7, setLoading7] = useState(true);

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
    if (usersMin3.length > 0) {
      setLoading4(false);
    }
    if (topCat.length > 0) {
      setLoading5(false);
    }
    if (commentC.length > 0) {
      setLoading6(false);
    }
    if (imgRatings.length > 0) {
      setLoading7(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBestImages = () => {
    console.log("fetchBestImages");
    fetch("http://localhost:4000/api/topCommentedImages")
      .then((response) => response.json())
      .then((result) => {
        setBestImages(result);
        localStorage.removeItem("bestImages");
        localStorage.setItem("bestImages", JSON.stringify(result));
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        console.error("Server error:", error);
        setIsLoading(false);
      });
  };

  const fetchCityImages = (cityID) => {
    console.log("fetchCityImages");
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
        setError(error);
        console.error("Server error:", error);
        setIsLoading2(false);
      });
  };

  const fetchTopUser = () => {
    console.log("fetchTopUser");
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

  const fetchusersMin3 = () => {
    console.log("fetchUsersMin3");
    fetch("http://localhost:4000/api/usersWithMin3Images")
      .then((res) => res.json())
      .then((data) => {
        setUsersMin3(data);
        localStorage.removeItem("usersMin3");
        localStorage.setItem("usersMin3", JSON.stringify(data));
        setLoading4(false);
      })
      .catch((err) => {
        console.error("Hiba a min3 images felhasználók lekérdezésekor:", err);
        setError(err);
        setLoading4(false);
      });
  };

  const fetchTopCat = () => {
    fetch("http://localhost:4000/api/topCategoriesByImageCount")
      .then((res) => res.json())
      .then((data) => {
        setTopCat(data);
        localStorage.removeItem("topCat");
        localStorage.setItem("topCat", JSON.stringify(data));
        setLoading5(false);
      })
      .catch((err) => {
        console.error("Hiba a min3 images felhasználók lekérdezésekor:", err);
        setError(err);
        setLoading5(false);
      });
  };

  const fetchCommentC = () => {
    fetch("http://localhost:4000/api/imageCommentCounts")
      .then((res) => res.json())
      .then((data) => {
        setCommentC(data);
        localStorage.removeItem("commentC");
        localStorage.setItem("commentC", JSON.stringify(data));
        setLoading6(false);
      })
      .catch((err) => {
        console.error("Hiba a min3 images felhasználók lekérdezésekor:", err);
        setError(err);
        setLoading6(false);
      });
  };

  const fetchImagesWithAvgRating = () => {
    fetch("http://localhost:4000/api/imagesWithAvgRating")
      .then((res) => res.json())
      .then((data) => {
        setImgRatings(data);
        localStorage.removeItem("imgRatings");
        localStorage.setItem("imgRatings", JSON.stringify(data));
        setLoading7(false);
      })
      .catch((err) => {
        console.error("Hiba a min3 images felhasználók lekérdezésekor:", err);
        setError(err);
        setLoading6(false);
      });
  };

  if (error) {
    return <div>Hiba : {error}</div>;
  }

  const refreshCity = (e) => {
    const value = e.target.value;
    setIsLoading2(true);
    localStorage.removeItem("cityImages");
    setSelectedCityId(value);
    console.log("refresh city", value);
    fetchCityImages(value);
  };

  const listCityImages = () => {
    fetchCityImages(selectedCityId);
  };

  const listUsersMin3 = () => {
    fetchusersMin3();
  };

  const listTopCat = () => {
    fetchTopCat();
  };

  const listCommentC = () => {
    fetchCommentC();
  };

  const listImgRating = () => {
    fetchImagesWithAvgRating();
  };

  return (
    <div className="home-page d-flex vh-100 custom-bg">
      <Sidebar />
      <div className="content">
        <div className="home">
          <div className="title d-flex justify-content-between align-items-center my-4 w-100">
            <h1 className="flex-grow-1 text-center m-0">Érdekességek</h1>
          </div>
          <div id="bestImages" className="my-4">
            <h2 className="flex-grow-1 text-center mb-3">
              Képek, amelyekhez a legtöbb hozzászólás érkezett (TOP 5)
            </h2>
            <Button className="my-4" onClick={fetchBestImages}>
              Listázz
            </Button>
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
              bestImages.length > 0 && <CustomList images={bestImages} />
            )}
          </div>
          <div id="cityImages" className="my-4">
            <h2 className="flex-grow-1 text-center mb-3">
              Adott város képei, amire legalább 1 hozzászólás érkezett
            </h2>
            <div className="form-group">
              <label className="form-label text-start w-25">
                Város:
                <select
                  name="city"
                  value={selectedCityId}
                  onChange={(e) => refreshCity(e)}
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

            <Button className="mb-4" onClick={listCityImages}>
              Listázz
            </Button>

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
              cityImages.length > 0 && <CustomList images={cityImages} />
            )}
          </div>
          <div id="topUsers" className=" p-3 my-4">
            <h2>
              Felhasználók és átlag pontszámuk, akiknek a képeire és albumaira
              legalább 2 értékelés érkezett
            </h2>
            <Button className="my-4" onClick={fetchTopUser}>
              Betöltés
            </Button>
            {loading3 ? (
              <p>Betöltés...</p>
            ) : users.length === 0 ? (
              <p>Nincs találat.</p>
            ) : (
              users.length > 0 && (
                <ul className="list-group list-group-flush">
                  {users.map((user, index) => (
                    <li className="list-group-item w-50 mx-auto" key={index}>
                      <strong>{user.FELHASZNALONEV}</strong>:{" "}
                      {user.ATLAG_ERTEKELES} / 5
                    </li>
                  ))}
                </ul>
              )
            )}
          </div>
          <div id="min3Images" className="rating-users p-3">
            <h2>Legalább 3 képet feltöltő felhasználók</h2>
            <Button onClick={listUsersMin3}>Listázz</Button>
            {loading4 ? (
              <p>Betöltés...</p>
            ) : users.length === 0 ? (
              <p>Nincs találat.</p>
            ) : (
              <ul className="list-group list-group-flush">
                {usersMin3.map((user, index) => (
                  <li className="list-group-item w-50 mx-auto" key={index}>
                    <strong>{user.FELHASZNALONEV}</strong>: {user.KEPEK_SZAMA}{" "}
                    kép
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div id="topCategories" className="rating-users p-3">
            <h2>Kategóriákhoz tartozó képek száma</h2>
            <Button className="my-4" onClick={listTopCat}>
              Listázz
            </Button>
            {loading5 ? (
              <p>Betöltés...</p>
            ) : users.length === 0 ? (
              <p>Nincs találat.</p>
            ) : (
              <div className="container mt-5">
                <div className="row">
                  {topCat.map((cat, index) => (
                    <div className="col-md-4 mb-2" key={index}>
                      <div className="border rounded p-2">
                        <strong>{cat.KATEGORIA}</strong>: {cat.KEPEK_SZAMA} db
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div id="imgCommentCount" className="rating-users p-3">
            <h2>Képek címe és hozzászólások száma képenként</h2>
            <Button className="my-4" onClick={listCommentC}>
              Listázz
            </Button>
            {loading6 ? (
              <p>Betöltés...</p>
            ) : users.length === 0 ? (
              <p>Nincs találat.</p>
            ) : (
              <div className="container">
                <div className="row">
                  {commentC
                    .filter((img) => Number(img.HOZZASZOLASOK_SZAMA) > 0)
                    .map((img, index) => (
                      <div className="col-md-4 mb-2" key={index}>
                        <div className="border rounded p-2 text-center">
                          <strong>{img.CIM}</strong>: {img.HOZZASZOLASOK_SZAMA}{" "}
                          db
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
          <div id="imgRating" className="rating-users p-3">
            <h2>
              Képek és hozzájuk tartozó átlagos értékelés, csak ahol már
              értékelték.
            </h2>
            <Button className="my-4" onClick={listImgRating}>
              Listázz
            </Button>
            {loading7 ? (
              <p>Betöltés...</p>
            ) : users.length === 0 ? (
              <p>Nincs találat.</p>
            ) : (
              <div className="container">
                <div className="row">
                  {imgRatings.map((img, index) => (
                    <div className="col-md-4 mb-2" key={index}>
                      <div className="border rounded p-2 text-center">
                        <strong>{img.CIM}</strong>: {img.ATLAG_ERTEKELES} / 5
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BestImages;
