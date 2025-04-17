import express from "express";
import oracledb from "oracledb";
import cors from "cors";
import bcrypt from "bcrypt";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = 4000;
const SALT_ROUNDS = 8;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const connectDB = async () => {
  return await oracledb.getConnection({
    user: "C##X8TRB2",
    password: "test123",
    connectString:
      "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=localhost)(PORT=1522))(CONNECT_DATA=(SID=orania2)))",
  });
};

app.get("/api/get/:tableName", async (req, res) => {
  const { tableName } = req.params;

  if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
    return res.status(400).send("❌ Érvénytelen tábla név");
  }

  try {
    const conn = await connectDB();
    const result = await conn.execute(`SELECT * FROM ${tableName}`, [], {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
    });
    await conn.close();
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send(`❌ Hiba a ${tableName} tábla lekérdezésekor`);
  }
});

app.post("/api/register", async (req, res) => {
  const { userName, email, password, cityId } = req.body;

  if (!userName || !email || !password || !cityId) {
    return res.status(400).send("Hiba: Minden mező kitöltése kötelező");
  }

  if (!emailRegex.test(email)) {
    return res.status(400).send("Hiba: Hibás email cím formátum");
  }

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    const conn = await connectDB();

    const emailCheck = await conn.execute(
      `SELECT COUNT(*) AS darab FROM felhasznalok WHERE email = :email`,
      { email },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (emailCheck.rows[0].DARAB > 0) {
      await conn.close();
      return res.status(409).send("Hiba: Ez az email cím már regisztrálva van");
    }

    const userNameCheck = await conn.execute(
      `SELECT COUNT(*) AS darab FROM felhasznalok WHERE felhasznalonev = :userName`,
      { userName },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (userNameCheck.rows[0].DARAB > 0) {
      await conn.close();
      return res
        .status(409)
        .send("Hiba: Ezzel a felhasználónévvel már regisztráltak");
    }

    await conn.execute(
      `INSERT INTO felhasznalok 
      (felhasznalonev, email, jelszo_hash, varos_id, reg_datum) 
      VALUES 
      ( :userName, :email, :password_hash, :cityID, SYSDATE)`,
      {
        userName,
        email,
        password_hash,
        cityID: Number(cityId),
      },
      { autoCommit: true }
    );
    await conn.close();
    res.status(201).send("Sikeres regisztráció");
  } catch (err) {
    console.error(err);
    res.status(500).send("Hiba: Hiba történt a regisztráció során");
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Hiba: Email és jelszó megadása kötelező");
  }

  if (!emailRegex.test(email)) {
    return res.status(400).send("Hiba: Hibás email cím formátum");
  }

  try {
    const conn = await connectDB();

    const result = await conn.execute(
      `SELECT felhasznalo_id, felhasznalonev, email, jelszo_hash, varos_id, reg_datum
       FROM felhasznalok 
       WHERE email = :email`,
      { email },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    await conn.close();

    if (result.rows.length === 0) {
      return res.status(401).send("Hiba: Hibás email!");
    }

    const user = result.rows[0];

    const passwordCorrect = await bcrypt.compare(password, user.JELSZO_HASH);
    if (!passwordCorrect) {
      return res.status(401).send("Hiba: Hibás jelszó!");
    }

    res.status(200).json({
      message: "✅ Sikeres bejelentkezés",
      user: {
        id: user.FELHASZNALO_ID,
        nev: user.FELHASZNALONEV,
        email: user.EMAIL,
        cityId: user.VAROS_ID,
        reg_datum: user.REG_DATUM,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Hiba: Hiba történt a bejelentkezés során");
  }
});

app.listen(PORT, () => {
  console.log(`Backend API fut a http://localhost:${PORT}`);
});





// Login api fetch in code:
/*
const raw = JSON.stringify({
  "email": "hash@admin.com" vagy egy változó, amit a felhasználó beír,
  "password": "admin123" vagy egy változó, amit a felhasználó beír
});

const requestOptions = {
  method: "POST",
  headers: {"Content-Type": "application/json"},
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:4000/api/login", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error)); 
  
// Register api fetch in code:

const raw = JSON.stringify({
  "userName": "testUser", vagy változók
  "email": "user@test.com",
  "password": "user123",
  "cityId": "2"
});

const requestOptions = {
  method: "POST",
  headers: {"Content-Type": "application/json"},
  body: raw,
  redirect: "follow"
};

fetch("http://localhost:4000/api/register", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));  */

//auto increasment for id-s
/*
CREATE SEQUENCE felhasznalo_seq
  START WITH 8
  INCREMENT BY 1
  NOCACHE
  NOCYCLE;

CREATE OR REPLACE TRIGGER felhasznalo_id_trigger
BEFORE INSERT ON felhasznalok
FOR EACH ROW
WHEN (NEW.felhasznalo_id IS NULL)
BEGIN
  SELECT felhasznalo_seq.NEXTVAL
  INTO :NEW.felhasznalo_id
  FROM dual;
END;*/
