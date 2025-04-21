### Adatbázis alapú rendszerek gyakorlat kötprog 2025

---

###### Projekt téma: Fényképalbumok

###### Csapattagok: Szabó Péter, Papp Máté, Szegedi Bence (X8TRB2)

##### BACKEND CONNECTION:

- Elsőnek a terminálban futtajuk  
  `ssh -L 1521:orania2.inf.u-szeged.hu:1521 hxxxxxx@linux.inf.u-szeged.hu`
  Nektek megvan elvileg a hozzáférés a táblákhoz, így saját h-s azonosítóval is működnie kell, terminálban be kell írni a jelszót.
- Egy új terminálban `npm run start`
- Még egy új terminálban `npm run dev`, ha nem talál valami dependecyt `npm install`

Így a frontend a `localhost:5173`-as porton fut, a backend a `localhost:4000`-en.

A`server.js` fájlban találtok hozzá segítséget hogyan tudjátok használni kódban a login és register apikat. Vissza adja a hibákat ha valami nem okés.

Jelenlegi apik tesztelve és működnek:

- GET `http://localhost:4000/api/get/:tableName` ez az api visszaadja a json formátumban a `tableName` alapján az adott tábla összes adatát. Pl: `/api/get/felhasznalok` az összes felhasználó adatát visszaadja, `/api/get/varosok` az összes város adatát visszaadja.
- POST `http://localhost:4000/api/register` ez bodyban várja az adatokat: `userName`,`email`,`password`,`cityId`. `Lásd server.js` vége.
- POST `http://localhost:4000/api/login` ez bodyban várja az adatokat: `email`,`password`. `Lásd server.js` vége.

---

Style: Bootstrap -> https://getbootstrap.com/docs/5.3/getting-started/introduction/
Egész componensek amiket használhattok: https://mui.com/toolpad/core/all-components/
vagy pl: https://getbootstrap.com/docs/5.3/components/card/
React amit tudni érdemes: https://www.w3schools.com/react/default.asp
React specifikus dolgok: https://www.w3schools.com/react/react_hooks.asp

Ha feature-t fejlesztetek, pl login, új branch-t hozzatok létre, és abba dolgozzatok. Ha kész van, akkor merge-elni kell a main-be. A main-be csak akkor lehet commit-olni, ha már review-ztuk a kódot. A review-t a github-on lehet kérni.
