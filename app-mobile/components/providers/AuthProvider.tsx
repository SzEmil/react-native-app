// components/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { mockLogin, mockRegister, type MockUser } from "../../lib/auth";
import { getStoredToken, isValidToken, setSession } from "../../lib/auth-utils";

// -------------------- typy --------------------

export type AuthUser = MockUser & {
  // tu potem możesz dodać: id, name, role itd.
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  //
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  refreshUser: () => Promise<void>;
};

// -------------------- stałe --------------------

const STORAGE_KEY_USER = "authUser";

// -------------------- kontekst --------------------

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// -------------------- Provider --------------------

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // co robimy, gdy token wygaśnie / sesja ma być wyczyszczona
  const handleTokenExpired = useCallback(() => {
    console.log("[Auth] Token expired / clean session");
    setUser(null);
    setToken(null);
  }, []);

  // inicjalizacja – odczyt usera + tokena z AsyncStorage
  useEffect(() => {
    const initialize = async () => {
      try {
        const storedToken = await getStoredToken();
        const storedUserJson = await AsyncStorage.getItem(STORAGE_KEY_USER);
        const storedUser: AuthUser | null = storedUserJson
          ? JSON.parse(storedUserJson)
          : null;

        if (storedToken && isValidToken(storedToken) && storedUser) {
          console.log("[Auth] found stored session");
          await setSession(storedToken, handleTokenExpired);
          setUser(storedUser);
          setToken(storedToken);
        } else {
          console.log("[Auth] no valid session");
          await setSession(null, handleTokenExpired);
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        console.error("[Auth] initialize error", err);
        await setSession(null, handleTokenExpired);
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [handleTokenExpired]);

  // LOGIN
  const signIn = useCallback(
    async (email: string, password: string) => {
      const resp = await mockLogin(email, password);

      // zapisujemy token (AsyncStorage + ewentualnie nagłówek w przyszłości)
      await setSession(resp.token, handleTokenExpired);

      const authUser: AuthUser = {
        email: resp.user.email,
      };

      setUser(authUser);
      setToken(resp.token);
      await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(authUser));
    },
    [handleTokenExpired]
  );

  // REGISTER (mock) – na razie działa jak login
  const register = useCallback(
    async (email: string, password: string) => {
      const resp = await mockRegister(email, password);

      await setSession(resp.token, handleTokenExpired);

      const authUser: AuthUser = {
        email: resp.user.email,
      };

      setUser(authUser);
      setToken(resp.token);
      await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(authUser));
    },
    [handleTokenExpired]
  );

  // REFRESH – na razie tylko z AsyncStorage
  const refreshUser = useCallback(async () => {
    try {
      const storedUserJson = await AsyncStorage.getItem(STORAGE_KEY_USER);
      const storedUser: AuthUser | null = storedUserJson
        ? JSON.parse(storedUserJson)
        : null;
      setUser(storedUser);
    } catch (error) {
      console.error("[Auth] refreshUser error", error);
    }
  }, []);

  // LOGOUT
  const signOut = useCallback(async () => {
    await setSession(null, handleTokenExpired);
    await AsyncStorage.removeItem(STORAGE_KEY_USER);
    setUser(null);
    setToken(null);
  }, [handleTokenExpired]);

  const authenticated = !!user && !!token;
  const unauthenticated = !authenticated && !loading;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      authenticated,
      unauthenticated,
      //
      signIn,
      signOut,
      register,
      refreshUser,
    }),
    [
      user,
      token,
      loading,
      authenticated,
      unauthenticated,
      signIn,
      signOut,
      register,
      refreshUser,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// -------------------- hook --------------------

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
