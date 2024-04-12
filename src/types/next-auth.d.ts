import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  export interface Session {
    user: SessionUser;
  }

  type SessionUser = {
    /** The user's id */
    id: string;
    login?: string;
    provider: string;
    isAdmin: boolean;
    isPowerUser?: boolean;
    // & DefaultSession["user"];
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };

  interface User {
    login?: string;
    provider: string;
  }
}
