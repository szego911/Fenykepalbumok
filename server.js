import express from "express";
import oracledb from "oracledb";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
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

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Csak JPG vagy PNG fájl engedélyezett"));
    }
  },
});

function lobToBase64(lob) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    lob.setEncoding("base64");

    lob.on("data", (chunk) => chunks.push(chunk));
    lob.on("end", () => resolve(chunks.join("")));
    lob.on("error", reject);
  });
}

app.get("/api/get/:tableName", async (req, res) => {
  const { tableName } = req.params;

  if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
    return res.status(400).send("Érvénytelen tábla név");
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
    res
      .status(500)
      .send(`Hiba a ${tableName} tábla lekérdezésekor, hiba: ${err}`);
  }
});

//FELHASZNALOK

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
    res.status(201).json({
      message: "✅ Sikeres bejelentkezés",
      success: true,
    });
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
      success: true,
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

//KEPEK

app.get("/api/allImages", async (req, res) => {
  try {
    const conn = await connectDB();
    const result = await conn.execute(
      `SELECT 
         k.*, 
         a.NEV AS ALBUM_NEV,
         v.NEV AS VAROS_NEV
       FROM kepek k
       JOIN albumok a ON k.ALBUM_ID = a.ALBUM_ID
       JOIN varosok v ON k.HELYSZIN_VAROS_ID = v.VAROS_ID`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const rows = [];

    for (const row of result.rows) {
      const newRow = { ...row };

      // BLOB konvertálás (pl. képek)
      for (const key of Object.keys(newRow)) {
        const val = newRow[key];
        if (val && typeof val === "object" && typeof val.on === "function") {
          newRow[key] = await lobToBase64(val);
        }
      }

      rows.push(newRow);
    }

    await conn.close();
    res.json(rows);
  } catch (err) {
    console.error("Hiba a képek lekérdezésekor:", err);
    res
      .status(500)
      .json({ message: "Hiba a képek lekérdezésekor", error: err });
  }
});

app.post("/api/upload/image", upload.single("kep"), async (req, res) => {
  const { felhasznalo_id, album_id, cim, leiras, helyszin_varos_id } = req.body;

  const kepPath = req.file?.path;
  if (!kepPath) {
    return res.status(400).json({ error: "Kép fájl hiányzik" });
  }

  const kepBuffer = fs.readFileSync(kepPath);

  let conn;
  try {
    conn = await connectDB();
    await conn.execute(
      `INSERT INTO kepek 
        (felhasznalo_id, album_id, cim, leiras, feltoltes_datum, helyszin_varos_id, kep) 
       VALUES 
        (:felhasznalo_id, :album_id, :cim, :leiras, SYSDATE, :helyszin_varos_id, :kep)`,
      {
        felhasznalo_id,
        album_id,
        cim,
        leiras,
        helyszin_varos_id,
        kep: kepBuffer,
      },
      { autoCommit: true }
    );

    res.status(200).json({ message: "✅ Kép sikeresen feltöltve" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "❌ Hiba a kép feltöltésekor" });
  } finally {
    fs.unlinkSync(kepPath);
    if (conn) await conn.close();
  }
});

app.get("/api/get/kep/:id", async (req, res) => {
  const kepId = req.params.id;

  let conn;
  try {
    conn = await connectDB();
    const result = await conn.execute(
      `SELECT KEP, CIM FROM kepek WHERE KEP_ID = :id`,
      [kepId],
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        fetchInfo: {
          KEP: { type: oracledb.BUFFER },
        },
      }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Nincs ilyen kép" });
    }

    const { KEP, CIM } = result.rows[0];

    res.set("Content-Type", "image/jpeg");
    res.set("Content-Disposition", `inline; filename="${CIM || "kep"}.jpg"`);
    res.send(KEP);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Hiba a kép lekérésekor" });
  } finally {
    if (conn) await conn.close();
  }
});

app.delete("/api/delete/kep/:id", async (req, res) => {
  const kepId = req.params.id;

  let conn;
  try {
    conn = await connectDB();

    const result = await conn.execute(
      `DELETE FROM kepek WHERE kep_id = :id`,
      [kepId],
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: "Nincs ilyen kép azonosítóval" });
    }

    res.status(200).json({ message: "Kép sikeresen törölve", success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Hiba a törlés során", err: err });
  } finally {
    if (conn) await conn.close();
  }
});

app.put("/api/update/kep/:id", upload.single("kep"), async (req, res) => {
  const kepId = req.params.id;
  const {
    felhasznalo_id,
    album_id,
    cim,
    leiras,
    feltoltes_datum,
    helyszin_varos_id,
  } = req.body;

  let kepBuffer = null;
  if (req.file) {
    kepBuffer = fs.readFileSync(req.file.path);
  }

  let conn;
  try {
    conn = await connectDB();

    const result = await conn.execute(
      `UPDATE kepek SET 
         felhasznalo_id = :felhasznalo_id,
         album_id = :album_id,
         cim = :cim,
         leiras = :leiras,
         feltoltes_datum = TO_DATE(:feltoltes_datum, 'YYYY-MM-DD'),
         helyszin_varos_id = :helyszin_varos_id
         ${kepBuffer ? ", kep = :kep" : ""}
       WHERE kep_id = :kep_id`,
      {
        felhasznalo_id,
        album_id,
        cim,
        leiras,
        feltoltes_datum,
        helyszin_varos_id,
        ...(kepBuffer ? { kep: kepBuffer } : {}),
        kep_id: kepId,
      },
      { autoCommit: true }
    );

    if (req.file) fs.unlinkSync(req.file.path);

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: "❌ Nincs ilyen kép azonosítóval" });
    }

    res.json({ message: "✅ Kép sikeresen frissítve", success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "❌ Hiba a frissítés során" });
  } finally {
    if (conn) await conn.close();
  }
});

app.patch(
  "/api/updatePatch/kep/:id",
  upload.single("kep"),
  async (req, res) => {
    const kepId = req.params.id;
    const fields = [];
    const values = { kep_id: kepId };

    if (req.body.felhasznalo_id) {
      fields.push("felhasznalo_id = :felhasznalo_id");
      values.felhasznalo_id = req.body.felhasznalo_id;
    }
    if (req.body.album_id) {
      fields.push("album_id = :album_id");
      values.album_id = req.body.album_id;
    }
    if (req.body.cim) {
      fields.push("cim = :cim");
      values.cim = req.body.cim;
    }
    if (req.body.leiras) {
      fields.push("leiras = :leiras");
      values.leiras = req.body.leiras;
    }
    if (req.body.feltoltes_datum) {
      fields.push("feltoltes_datum = TO_DATE(:feltoltes_datum, 'YYYY-MM-DD')");
      values.feltoltes_datum = req.body.feltoltes_datum;
    }
    if (req.body.helyszin_varos_id) {
      fields.push("helyszin_varos_id = :helyszin_varos_id");
      values.helyszin_varos_id = req.body.helyszin_varos_id;
    }

    if (req.file) {
      const kepBuffer = fs.readFileSync(req.file.path);
      fields.push("kep = :kep");
      values.kep = kepBuffer;
      fs.unlinkSync(req.file.path);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: "❌ Nincs frissítendő mező" });
    }

    const sql = `UPDATE kepek SET ${fields.join(", ")} WHERE kep_id = :kep_id`;

    let conn;
    try {
      conn = await connectDB();
      const result = await conn.execute(sql, values, { autoCommit: true });

      if (result.rowsAffected === 0) {
        return res
          .status(404)
          .json({ error: "❌ Nincs ilyen kép azonosítóval" });
      }

      res.json({ message: "✅ Kép sikeresen frissítve", success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "❌ Hiba a frissítés során" });
    } finally {
      if (conn) await conn.close();
    }
  }
);

//ALBUMOK

app.post("/api/create/album", async (req, res) => {
  const { nev, leiras } = req.body;
  const felhasznalo_id = "1";
  try {
    const conn = await connectDB();

    await conn.execute(
      `INSERT INTO albumok (felhasznalo_id, nev, leiras, letrehozas_datum)
       VALUES (:felhasznalo_id, :nev, :leiras, SYSDATE)`,
      { felhasznalo_id, nev, leiras },
      { autoCommit: true }
    );

    await conn.close();
    res
      .status(201)
      .json({ message: "Album sikeresen létrehozva", success: true });
  } catch (err) {
    console.error("Hiba album létrehozásakor:", err);
    res.status(500).json({ message: "Hiba album létrehozásakor", error: err });
  }
});

app.delete("/api/delete/album/:id", async (req, res) => {
  const albumId = req.params.id;

  let conn;
  try {
    conn = await connectDB();

    const result = await conn.execute(
      `DELETE FROM albumok WHERE album_id = :album_id`,
      { album_id: albumId },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res
        .status(404)
        .json({ error: "❌ Nincs ilyen album azonosítóval" });
    }

    res.json({ message: "✅ Album sikeresen törölve", success: true });
  } catch (err) {
    console.error("Hiba az album törlésekor:", err);
    res.status(500).json({ error: "❌ Hiba az album törlése során", err });
  } finally {
    if (conn) await conn.close();
  }
});

app.patch("/api/update/album/:id", async (req, res) => {
  const albumId = req.params.id;
  const { nev, leiras } = req.body;

  if (!nev && !leiras) {
    return res
      .status(400)
      .json({ error: "❌ Az 'nev' vagy 'leiras' mező kötelező" });
  }

  let conn;
  try {
    conn = await connectDB();

    const fields = [];
    const values = { album_id: albumId };

    if (nev) {
      fields.push("nev = :nev");
      values.nev = nev;
    }
    if (leiras) {
      fields.push("leiras = :leiras");
      values.leiras = leiras;
    }

    const sql = `UPDATE albumok SET ${fields.join(
      ", "
    )} WHERE album_id = :album_id`;

    const result = await conn.execute(sql, values, { autoCommit: true });

    if (result.rowsAffected === 0) {
      return res
        .status(404)
        .json({ error: "❌ Nincs ilyen album azonosítóval" });
    }

    res.json({ message: "✅ Album sikeresen módosítva", success: true });
  } catch (err) {
    console.error("Hiba az album módosítása során:", err);
    res.status(500).json({ error: "❌ Hiba az album módosítása során", err });
  } finally {
    if (conn) await conn.close();
  }
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `❌ Multer hiba: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

//ÉRTÉKELÉSEK

//HOZZÁSZÓLÁSOK
app.post("/api/create/hozzaszolas", async (req, res) => {
  const { kep_id, felhasznalo_id, tartalom } = req.body;

  try {
    const conn = await connectDB();

    await conn.execute(
      `INSERT INTO hozzaszolasok (kep_id, felhasznalo_id, tartalom, datum)
       VALUES (:kep_id, :felhasznalo_id, :tartalom, SYSDATE)`,
      { kep_id, felhasznalo_id, tartalom },
      { autoCommit: true }
    );

    await conn.close();
    res
      .status(201)
      .json({ message: "Hozzászólás sikeresen létrehozva", success: true });
  } catch (err) {
    console.error("Hiba hozzászólás létrehozásakor:", err);
    res
      .status(500)
      .json({ message: "Hiba hozzászólás létrehozásakor", error: err });
  }
});

app.delete("/api/delete/hozzaszolas/:id", async (req, res) => {
  const hozzaszolas_id = req.params.id;

  try {
    const conn = await connectDB();

    const result = await conn.execute(
      `DELETE FROM hozzaszolasok WHERE hozzaszolas_id = :hozzaszolas_id`,
      { hozzaszolas_id },
      { autoCommit: true }
    );

    await conn.close();

    if (result.rowsAffected === 0) {
      return res
        .status(404)
        .json({ message: "Nincs ilyen hozzászólás", success: false });
    }

    res.json({ message: "Hozzászólás sikeresen törölve", success: true });
  } catch (err) {
    console.error("Hiba hozzászólás törlésekor:", err);
    res
      .status(500)
      .json({ message: "Hiba hozzászólás törlésekor", error: err });
  }
});

app.patch("/api/update/hozzaszolas/:id", async (req, res) => {
  const hozzaszolas_id = req.params.id;
  const fields = req.body;

  if (Object.keys(fields).length === 0) {
    return res
      .status(400)
      .json({ message: "Nincs frissítendő adat", success: false });
  }

  const allowedFields = ["kep_id", "felhasznalo_id", "tartalom"];
  const updates = [];
  const bindParams = { hozzaszolas_id };

  for (const key of allowedFields) {
    if (fields[key] !== undefined) {
      updates.push(`${key} = :${key}`);
      bindParams[key] = fields[key];
    }
  }

  if (updates.length === 0) {
    return res
      .status(400)
      .json({ message: "Nincs érvényes mező a frissítéshez", success: false });
  }

  const sql = `UPDATE hozzaszolasok SET ${updates.join(
    ", "
  )} WHERE hozzaszolas_id = :hozzaszolas_id`;

  try {
    const conn = await connectDB();
    const result = await conn.execute(sql, bindParams, { autoCommit: true });
    await conn.close();

    if (result.rowsAffected === 0) {
      return res
        .status(404)
        .json({ message: "Nincs ilyen hozzászólás", success: false });
    }

    res.json({ message: "Hozzászólás sikeresen frissítve", success: true });
  } catch (err) {
    console.error("Hiba hozzászólás frissítésekor:", err);
    res
      .status(500)
      .json({ message: "Hiba hozzászólás frissítésekor", error: err });
  }
});

//VÁROSOK

app.post("/api/create/varos", async (req, res) => {
  const { nev, megye, iranyitoszam } = req.body;

  try {
    const conn = await connectDB();

    await conn.execute(
      `INSERT INTO varosok (nev, megye, iranyitoszam)
       VALUES (:nev, :megye, :iranyitoszam)`,
      { nev, megye, iranyitoszam },
      { autoCommit: true }
    );

    await conn.close();
    res
      .status(201)
      .json({ message: "Város sikeresen hozzáadva", success: true });
  } catch (err) {
    console.error("Hiba város hozzáadásakor:", err);
    res.status(500).json({ message: "Hiba város hozzáadásakor", error: err });
  }
});

app.delete("/api/delete/varos/:id", async (req, res) => {
  const varos_id = req.params.id;

  try {
    const conn = await connectDB();

    const result = await conn.execute(
      `DELETE FROM varosok WHERE varos_id = :varos_id`,
      { varos_id },
      { autoCommit: true }
    );

    await conn.close();

    if (result.rowsAffected === 0) {
      return res
        .status(404)
        .json({ message: "Nincs ilyen város", success: false });
    }

    res.json({ message: "Város sikeresen törölve", success: true });
  } catch (err) {
    console.error("Hiba város törlésekor:", err);
    res.status(500).json({ message: "Hiba város törlésekor", error: err });
  }
});

app.patch("/api/update/varos/:id", async (req, res) => {
  const varos_id = req.params.id;
  const fields = req.body;

  if (Object.keys(fields).length === 0) {
    return res
      .status(400)
      .json({ message: "Nincs frissítendő adat", success: false });
  }

  const allowedFields = ["nev", "megye", "iranyitoszam"];
  const updates = [];
  const bindParams = { varos_id };

  for (const key of allowedFields) {
    if (fields[key] !== undefined) {
      updates.push(`${key} = :${key}`);
      bindParams[key] = fields[key];
    }
  }

  if (updates.length === 0) {
    return res
      .status(400)
      .json({ message: "Nincs érvényes mező a frissítéshez", success: false });
  }

  const sql = `UPDATE varosok SET ${updates.join(
    ", "
  )} WHERE varos_id = :varos_id`;

  try {
    const conn = await connectDB();
    const result = await conn.execute(sql, bindParams, { autoCommit: true });
    await conn.close();

    if (result.rowsAffected === 0) {
      return res
        .status(404)
        .json({ message: "Nincs ilyen város", success: false });
    }

    res.json({ message: "Város sikeresen frissítve", success: true });
  } catch (err) {
    console.error("Hiba város frissítésekor:", err);
    res.status(500).json({ message: "Hiba város frissítésekor", error: err });
  }
});

app.listen(4000, () => {
  console.log("✅ API fut: http://localhost:4000");
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
