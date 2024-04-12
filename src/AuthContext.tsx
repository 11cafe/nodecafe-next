import { createContext } from "react";

export type AuthContextType = {
  username: string | null;
  isAdmin: boolean;
  setUsername: (username: string) => void;
  profileName: string | null;
};

export const AuthContext = createContext<AuthContextType>({
  username: null,
  isAdmin: false,
  setUsername: () => {},
  profileName: null,
});
