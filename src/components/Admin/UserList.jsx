import React, { useEffect, useState } from "react";

function UserList() {
  const [users, setUsers] = useState([]);
  const [hiba, setHiba] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/users")
      .then((res) => {
        if (!res.ok) throw new Error("Hiba történt a lekérés során");
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => setHiba(err.message));
  }, []);

  if (hiba) return <p style={{ color: "red" }}>{hiba}</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Felhasználók</h2>
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Név</th>
            <th>Email</th>
            <th>Város</th>
            <th>Regisztráció</th>
            <th>Szerep</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nev}</td>
              <td>{user.email}</td>
              <td>{user.city}</td>
              <td>{new Date(user.reg_datum).toLocaleDateString()}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
