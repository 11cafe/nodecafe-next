import { AuthContext, AuthContextType } from "@/AuthContext";
import Navbar from "./navbar";
import { Inter } from "next/font/google";
import React, { HTMLProps, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { FooterCentered } from "./FooterCentered";
import { Flex } from "@chakra-ui/react";

const inter = Inter({ subsets: ["latin"] });
export default function Layout({ children }: HTMLProps<HTMLDivElement>) {
  const [username, setUsername] = React.useState<string | null>(null);
  const [profileName, setProfileName] = React.useState<string | null>(null);
  const [isAdmin, setIsAdmin] = React.useState<boolean>(false);

  return (
    <AuthContext.Provider
      value={{
        username,
        isAdmin,
        setUsername,
        profileName,
      }}
    >
      <Flex
        direction={"column"}
        w={"100%"}
        maxW={1920}
        alignItems={"center"}
        style={{
          overflow: "hidden",
          minHeight: "100vh",
          margin: "0 auto",
        }}
      >
        <Navbar />
        {children}
        <FooterCentered />

        <Analytics />
      </Flex>
    </AuthContext.Provider>
  );
}
