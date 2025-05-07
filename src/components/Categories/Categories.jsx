import React, { useState, useEffect } from "react";
import "./Categories.css";
import Sidebar from "../Sidebar/Sidebar";
import CategoryList from "../CategoryList/CategoryList";
import Tile from "../Tile/Tile";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:4000/api/get/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error("Invalid data format", data);
        }
      })
      .catch((error) => console.error("Hiba a kategóriák lekérésekor:", error));
  }, []);

  const fetchImagesByCategory = async (categoryId) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:4000/api/imagesByCategory/${categoryId}`
      );
      const result = await response.json();
      setImages(result);
    } catch (error) {
      console.error("Hiba a képek lekérdezésekor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      fetchImagesByCategory(categoryId);
    } else {
      setImages([]);
    }
  };

  return (
    <div className="home-page d-flex vh-100 custom-bg">
      <Sidebar />
      <div className="content">
        <div className="home" style={{ display: "flex", flexDirection: "column" }}>
          <div className="title d-flex justify-content-between align-items-center m-4">
            <h1 className="flex-grow-1 text-center m-0">Kategóriák</h1>
          </div>

          <div className="category-selector mb-3">
            <CategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />
          </div>

          <div className="images-list mt-4">
            {isLoading ? (
              <p>Betöltés...</p>
            ) : images.length > 0 ? (
              images.map((image) => (
                <Tile
                  key={image.KEP_ID}
                  kep_id={image.KEP_ID}
                  cim={image.CIM}
                  album_title={image.ALBUM_NEV}
                  varos={image.VAROS_NEV}
                  kep={image.KEP}
                />
              ))
            ) : (
              <p>Nincs elérhető kép ebben a kategóriában.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;