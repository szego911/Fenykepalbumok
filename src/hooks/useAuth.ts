import { useEffect, useState } from "react";

export const useAuth = () => {
  const [user, setUser] = useState(() => {
    const data = localStorage.getItem("userData");
    return data ? JSON.parse(data) : null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const data = localStorage.getItem("userData");
      setUser(data ? JSON.parse(data) : null);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return {
    user,
    isLoggedIn: !!user,
    isAdmin: user?.role === "admin",
  };
};
