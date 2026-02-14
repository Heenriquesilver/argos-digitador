import { createContext } from "react";

export interface AuthContextType {
  user: any;
  loginPassword: (email: string, credential: string) => Promise<void>;
  loginCode: (email: string, credential: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);
