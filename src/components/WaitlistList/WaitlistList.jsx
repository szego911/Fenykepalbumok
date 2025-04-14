import React from "react";
import "./WaitlistList.css";

import { useState, useEffect } from "react";
import Waitlist from "../Waitlist/Waitlist";

function WaitlistList() {
  const [waitlists, setWaitlist] = useState([]);
  /*
  useEffect(() => {
    fetch( window._env_.BACKEND_URL + "/waitlist/list-extended")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setWaitlist(data.waitlists);
        } else {
          throw new Error("Server returned unsuccessful response");
        }
      })
      .catch((error) => {
        console.error("Error fetching waitlist:", error);
        setWaitlist([]);
      });
  }, []);
*/
  return (
    <div className="waitlist-list">
      {waitlists.map((waitlist) => (
        <Waitlist waitlist={waitlist} />
      ))}
    </div>
  );
}

export default WaitlistList;
