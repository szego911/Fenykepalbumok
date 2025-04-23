import { useMemo } from "react";

export const useAuth = () => {
  const user = useMemo(() => {
    const data = localStorage.getItem("userData");
    return data ? JSON.parse(data) : null;
  }, []);

  const isLoggedIn = !!user;

  return { user, isLoggedIn };
};
