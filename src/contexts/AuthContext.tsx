import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { AuthService } from "../services/AuthService";
import { tokenStorage } from "../utils/tokenStorage";
import { decodeJwt } from "../utils/decodeJwt";
import type { IUser } from "../models/IUser";
import type { SignUpDto } from "../models/dto/SignUp";
import type { SignInDto } from "../models/dto/SignIn";

interface AuthContextValue {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signUp: (data: SignUpDto) => Promise<void>;
  signIn: (data: SignInDto) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const authService = new AuthService();

function isExpired(exp: number): boolean {
  return exp * 1000 <= Date.now();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function bootstrapSession() {
      const token = tokenStorage.getToken();

      if (!token) {
        setIsLoading(false);
        return;
      }

      const payload = decodeJwt(token);

      if (!payload || isExpired(payload.exp)) {
        tokenStorage.clearToken();
        setUser(null);
        setIsLoading(false);
        return;
      }

      setUser({ id: payload.sub, name: payload.name, email: payload.email });

      try {
        const response = await authService.getMe();
        setUser(response.data);
      } catch {
        tokenStorage.clearToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    bootstrapSession();
  }, []);

  async function signUp(data: SignUpDto): Promise<void> {
    // SPEC_DEVIATION: signup does not return a token - design.md: "cria conta, retorna
    // perfil público (sem token; a usuária loga em seguida)" - so it cannot store a
    // token or set the session user here.
    // Reason: matches the backend contract and T22's done-when (navigate to /login
    // after signup, not to Home), overriding this task's loosely-worded summary.
    await authService.signUp(data);
  }

  async function signIn(data: SignInDto): Promise<void> {
    const { accessToken } = await authService.signIn(data);
    tokenStorage.setToken(accessToken);

    const payload = decodeJwt(accessToken);
    if (payload) {
      setUser({ id: payload.sub, name: payload.name, email: payload.email });
    }
  }

  function logout(): void {
    tokenStorage.clearToken();
    setUser(null);
  }

  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    signUp,
    signIn,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
