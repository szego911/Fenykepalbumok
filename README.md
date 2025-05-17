### Adatbázis alapú rendszerek gyakorlat kötprog 2025

---

##### Projekt téma: Fényképalbumok

##### Csapattagok: Szabó Péter, Papp Máté, Szegedi Bence

##### BACKEND CONNECTION:

- Elsőnek a terminálban futtajuk  
  `ssh -L 1522:orania2.inf.u-szeged.hu:1521 h269466@linux.inf.u-szeged.hu`
  `koktelHagyma675`
  Nektek megvan elvileg a hozzáférés a táblákhoz, így saját h-s azonosítóval is működnie kell, terminálban be kell írni a jelszót.
- Egy új terminálban `npm run start`
- Még egy új terminálban `npm run dev`, ha nem talál valami dependecyt `npm install`

Így a frontend a `localhost:5173`-as porton fut, a backend a `localhost:4000`-en.

A`server.js` fájlban található az összes api endpoint.

# API Dokumentáció

## 📸 KÉPEK

| Endpoint                                | Leírás                                                            | Típus  | Paraméterek                             | Válasz                              |
| :-------------------------------------- | :---------------------------------------------------------------- | :----- | :-------------------------------------- | :---------------------------------- |
| GET /api/allImages                      | Minden kép lekérdezése album és városnévvel, BLOB konvertálással. | GET    | -                                       | Képek adatai (base64-es képmezővel) |
| POST /api/upload/image                  | Kép feltöltése a megadott adatokkal.                              | POST   | multipart/form-data                     | Feltöltés eredménye                 |
| GET /api/get/kep/:id                    | Kép lekérése azonosító alapján, kép megjelenítése JPEG-ként.      | GET    | id (param)                              | Kép bináris adatként                |
| DELETE /api/delete/kep/:id              | Kép törlése azonosító alapján.                                    | DELETE | id (param)                              | Törlés státusza                     |
| PUT /api/update/kep/:id                 | Kép adatainak teljes frissítése.                                  | PUT    | id (param), minden képmező + kép (body) | Frissítés státusza                  |
| PATCH /api/updatePatch/kep/:id          | Kép részleges frissítése.                                         | PATCH  | id (param), tetszőleges mezők           | Frissítés státusza                  |
| GET /api/imagesByCategory/:kategoria_id | Kategória alapján képek lekérdezése, BLOB-bal együtt.             | GET    | kategoria_id (param)                    | Kép objektumok                      |

## 👤 FELHASZNÁLÓK

| Endpoint                           | Leírás                                                | Típus  | Paraméterek                              | Válasz                          |
| :--------------------------------- | :---------------------------------------------------- | :----- | :--------------------------------------- | :------------------------------ |
| POST /api/register                 | Új felhasználó regisztrálása.                         | POST   | userName, email, password, cityId (body) | Sikeres regisztrációs üzenet    |
| POST /api/login                    | Felhasználó bejelentkezés email és jelszó alapján.    | POST   | email, password (body)                   | Felhasználói adatok, ha sikeres |
| PATCH /api/update/felhasznalo/:id  | Felhasználó adatainak frissítése (név, email, város). | PATCH  | id (param), nev, email, city (body)      | Frissített felhasználói adatok  |
| DELETE /api/delete/felhasznalo/:id | Felhasználó törlése azonosító alapján.                | DELETE | id (param)                               | Törlés státusza                 |
| GET /api/users                     | Minden felhasználó lekérdezése.                       | GET    | -                                        | Felhasználók listája            |
| DELETE /api/delete/felhasznalo/:id | Felhasználó törlése azonosító alapján.                | DELETE | id (param)                               | Törlés státusza                 |

## 💬 HOZZÁSZÓLÁSOK

| Endpoint                           | Leírás                                              | Típus  | Paraméterek                             | Válasz                 |
| :--------------------------------- | :-------------------------------------------------- | :----- | :-------------------------------------- | :--------------------- |
| POST /api/create/hozzaszolas       | Új hozzászólás létrehozása (pl. tárolt eljárással). | POST   | kep_id, felhasznalo_id, tartalom (body) | Siker vagy hiba üzenet |
| DELETE /api/delete/hozzaszolas/:id | Hozzászólás törlése azonosító alapján.              | DELETE | id (URL paraméter)                      | Siker vagy hiba üzenet |
| PATCH /api/update/hozzaszolas/:id  | Hozzászólás részleges frissítése.                   | PATCH  | id (URL paraméter), mezők (body)        | Siker vagy hiba üzenet |

## ⭐ ÉRTÉKELÉSEK

| Endpoint                        | Leírás                                                  | Típus | Paraméterek            | Válasz                       |
| :------------------------------ | :------------------------------------------------------ | :---- | :--------------------- | :--------------------------- |
| GET /api/get/ertekelesek/:kepId | Lekérdezi egy adott kép értékeléseit felhasználónévvel. | GET   | kep_id (URL paraméter) | Értékelés objektumok listája |

## 📁 ALBUMOK

| Endpoint                             | Leírás                                      | Típus | Paraméterek                        | Válasz                    |
| :----------------------------------- | :------------------------------------------ | :---- | :--------------------------------- | :------------------------ |
| POST /api/create/album               | Új album létrehozása tárolt eljárással.     | POST  | felhasznalo_id, nev, leiras (body) | Sikeres létrehozás üzenet |
| GET /api/get/albumok/:felhasznalo_id | Felhasználóhoz tartozó albumok lekérdezése. | GET   | felhasznalo_id (param)             | Album objektumok listája  |

## 🏙️ VÁROSOK

| Endpoint                     | Leírás                                    | Típus  | Paraméterek                      | Válasz                       |
| :--------------------------- | :---------------------------------------- | :----- | :------------------------------- | :--------------------------- |
| POST /api/create/varos       | Új város létrehozása.                     | POST   | nev, megye, iranyitoszam (body)  | Siker vagy hiba üzenet       |
| GET /api/varosok             | Városok listázása névvel és azonosítóval. | GET    | -                                | Városok tömb (varos_id, nev) |
| DELETE /api/delete/varos/:id | Város törlése azonosító alapján.          | DELETE | id (URL paraméter)               | Siker vagy hiba üzenet       |
| PATCH /api/update/varos/:id  | Város adatainak részleges frissítése.     | PATCH  | id (URL paraméter), mezők (body) | Siker vagy hiba üzenet       |

## 🏷️ KATEGÓRIÁK

| Endpoint                | Leírás                        | Típus | Paraméterek | Válasz              |
| :---------------------- | :---------------------------- | :---- | :---------- | :------------------ |
| GET /api/get/categories | Minden kategória lekérdezése. | GET   | -           | Kategória ID és név |

## 📸 Összetett lekérdezések

| Endpoint                                | Leírás                                                                | Típus | Paraméterek       | Válasz                               |
| :-------------------------------------- | :-------------------------------------------------------------------- | :---- | :---------------- | :----------------------------------- |
| GET /api/topCommentedImages             | Legtöbb hozzászólással rendelkező képek (TOP 5).                      | GET   | -                 | Kép objektumok BLOB-bal együtt       |
| POST /api/imagesWithCommentsFromCity    | Képek lekérése adott városból, ahol van hozzászólás.                  | POST  | cityId (body)     | Kép objektumok (BLOB-bal)            |
| GET /api/usersWithAvgRatingOver2        | Felhasználók, akik képeire átlagosan legalább 2 értékelés érkezett.   | GET   | -                 | Felhasználónév és átlag értékelés    |
| GET /api/usersWithMin3Images            | Felhasználók, akik legalább 3 képet töltöttek fel.                    | GET   | -                 | Felhasználónév és képek száma        |
| GET /api/topCategoriesByImageCount      | Legnépszerűbb kategóriák képszám szerint.                             | GET   | -                 | Kategória neve, képek száma          |
| GET /api/imageCommentCounts             | Képek címe és hozzászólások száma képenként.                          | GET   | -                 | Kép címe és hozzászólások darabszáma |
| GET /api/imagesWithAvgRating            | Képek és hozzájuk tartozó átlagos értékelés (csak ahol van értékelés) | GET   | -                 | Kép címe és átlag értékelés          |
| GET /api/imagesByCategory/:kategoria_id | Képek kategória id alapján                                            | POST  | categoryId (body) | Kép objektumok BLOB-bal együtt       |

Style: Bootstrap -> https://getbootstrap.com/docs/5.3/getting-started/introduction/
Egész componensek amiket használhattok: https://mui.com/toolpad/core/all-components/
vagy pl: https://getbootstrap.com/docs/5.3/components/card/
React amit tudni érdemes: https://www.w3schools.com/react/default.asp
React specifikus dolgok: https://www.w3schools.com/react/react_hooks.asp
