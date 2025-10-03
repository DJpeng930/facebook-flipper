import { createContext, useContext, useState, ReactNode, useEffect, useRef } from "react";
import { User } from "../../../shared/types";

interface UserContextType {
  user: User | null;
  login: () => Promise<boolean>;
  logout: () => void;
  refreshSession: () => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const LOCAL_STORAGE_KEY = "fb_session_cache";

  // Use a ref to track if the effect has already run
  const effectRan = useRef(false);

  useEffect(() => {
    // Only run once
    if (effectRan.current === true) {
      return;
    }

    async function checkSession() {
      setLoading(true);
      const cachedSession = localStorage.getItem(LOCAL_STORAGE_KEY);

      if (cachedSession) {
        const user: User = JSON.parse(cachedSession);
        setUser(user);
      } else {
        await refreshSession();
      }
      setLoading(false);
    }

    checkSession();

    // Mark effect as run
    effectRan.current = true;
  }, []);

  async function login(): Promise<boolean> {
    const fbLogin = await window.api.facebook.openLogin();

    console.log("FB Login Result:", fbLogin);

    if (fbLogin) {
      const loggedInUser: User = fbLogin;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      window.location.href = "/";
      return true;
    }
    return false;
  }

  async function logout() {
    setLoading(true);

    // Ensure user is logged in before attempting logout
    await refreshSession();
    if (!user) {
      // No user logged in
      setLoading(false);
      return;
    }

    //if user is logged in, proceed to log out
    const loggedOut = await window.api.facebook.logout();

    // ifLogout failed
    if (!loggedOut) {
      setLoading(false);
      return;
    }

    setUser(null);
    // Clear the cached session when logging out
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setLoading(false);
  }

  async function refreshSession() {
    const user = await window.api.facebook.checkSession();

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    setUser(user);
  }

  const value: UserContextType = {
    user,
    login,
    logout,
    refreshSession,
    loading
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

//eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
