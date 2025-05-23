import React, { useState } from "react";
import { useNavigate,Link } from "react-router";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const login = () => {
    setLoginError("");

    if (!email || !password) {
      setLoginError("Kérlek tölts ki minden mezőt a bejelentkezéshez.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLoginError("Kérlek érvényes email-címet adj meg.");
      return;
    }

    const raw = JSON.stringify({
      email,
      password,
    });

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:4000/api/login", requestOptions)
      .then(async (response) => {
        const text = await response.text();
        try {
          const data = JSON.parse(text);
          if (data.success) {
            localStorage.setItem("userData", JSON.stringify(data.user));
            alert("Sikeres bejelentkezés!");
            navigate("/home");
          } else {
            throw new Error(
              data.error || "Nem megfelelő email-cím vagy jelszó."
            );
          }
        } catch (error) {
          console.error("Login feldolgozás hiba:", error);
          throw new Error("Nem megfelelő email-cím vagy jelszó.");
        }
      })
      .catch((error) => setLoginError(error.message));
  };

  const guestUser = () => {
    navigate("/home");
  };

  return (
    <div className="d-flex vh-100 custom-bg align-items-center">
      <div className="login">
        <div className="login-container shadow">
          <h3 className="text-center poppins">PhotoShare</h3>
          <h1 className="text-center poppins">Bejelentkezés</h1>

          {/* Hibák megjelenítése */}
          {loginError && <div className="alert alert-danger">{loginError}</div>}

          <form>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Email-cím</label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder=""
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Jelszó</label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                placeholder=""
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </form>

          <button type="button" className="btn btn-primary" onClick={login}>
            Bejelentkezés
          </button>
          <div className="d-flex">
            <p className="login-login">
              Nincs még fiókod? Regisztrálj{" "}
              <Link to="/register">
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

export default Login;
