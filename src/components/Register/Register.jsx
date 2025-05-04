import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [userName, setUserName] = useState("");

  const [registerError, setRegisterError] = useState("");
  const [cityId, setCityId] = useState("");
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/varosok")
      .then((res) => res.json())
      .then((data) => setCities(data))
      .catch((err) => console.error("Városok betöltése sikertelen:", err));
  }, []);

  const register = () => {
    setRegisterError("");

    if (!userName || !email || !password || !password2) {
      setRegisterError("Kérlek tölts ki minden mezőt a regisztrációhoz.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setRegisterError("Kérlek érvényes email-címet adj meg.");
      return;
    }

    if (password !== password2) {
      setRegisterError("A megadott jelszavak nem egyeznek!");
      return;
    }

    const raw = JSON.stringify({
      userName,
      email,
      password,
      cityId,
    });

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:4000/api/register", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Sikeres regisztráció! Most jelentkezz be!");
          navigate("/login");
        } else {
          throw new Error(data.error || "Hiba történt a regisztráció során.");
        }
      })
      .catch((error) => setRegisterError(error.message));
  };

  const guestUser = () => {
    navigate("/home");
  };

  return (
    <div className="d-flex vh-100 custom-bg align-items-center">
      <div className="login">
        <div className="mt-20 login-container shadow">
          <h3 className="text-center poppins">PhotoShare</h3>
          <h1 className="text-center poppins">Regisztráció</h1>

          {/* Hibák megjelenítése */}
          {registerError && (
            <div className="alert alert-danger">{registerError}</div>
          )}

          <form>
            <div className="form-group">
              <label htmlFor="username">Felhasználónév</label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email-cím</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <small id="emailHelp" className="form-text text-muted">
                Soha nem osztjuk meg másokkal az e-mail címed.
              </small>
            </div>

            <div className="form-group">
              <label className="form-label text-start w-100">
                Város:
                <select
                  name="city"
                  value={cityId}
                  onChange={(e) => setCityId(e.target.value)}
                  className="form-control"
                  required
                >
                  <option value="" disabled hidden>
                    Válassz várost
                  </option>
                  {cities.map((city) => (
                    <option key={city.VAROS_ID} value={city.VAROS_ID}>
                      {city.NEV}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="password">Jelszó</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password2">Jelszó újra</label>
              <input
                type="password"
                className="form-control"
                id="password2"
                name="password2"
                onChange={(e) => setPassword2(e.target.value)}
              />
            </div>
          </form>

          <button className="btn btn-primary" onClick={register}>
            Regisztráció
          </button>
          <div className="d-flex">
            <p className="login-login">
              Van már fiókod? Lépj be{" "}
              <Link to="/login">
                <span className="text-primary underline-on-hover">itt</span>
              </Link>{" "}
              vagy folytastsd{" "}
              <span
                className="text-primary underline-on-hover"
                onClick={guestUser}
              >
                vendégként
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
