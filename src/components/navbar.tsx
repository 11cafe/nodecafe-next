import { useContext, useState } from "react";
import LoginButton from "./LoginButton";
import { AuthContext } from "@/AuthContext";
import Link from "next/link";
import {
  Button,
  Flex,
  Text,
  IconButton,
  useColorMode,
  HStack,
  Heading,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { IconMoon, IconSun } from "@tabler/icons-react";
import NodeSearchTypeahead from "./NodeSearchTypeahead";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const navigation: Array<{ name: string; href: string }> = [
  // { name: "AI generator", href: "/" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();
  const curPath = router.pathname;

  return (
    <header style={{ width: "100%" }}>
      <nav aria-label="Global">
        <Flex
          width={"100%"}
          justifyContent={"space-between"}
          flexGrow={1}
          px={[2, 3, 14]}
          py={[2, 3, 4]}
          wrap={"wrap"}
        >
          <HStack gap={[2, 2, 18]} wrap={"wrap"}>
            <ChakraLink href="/" flexDir={"row"}>
              <HStack alignItems={"center"}>
                <img
                  width={26}
                  height={26}
                  aria-label="comfyspace-logo"
                  src={"../../favicon.ico"}
                  alt=""
                />
                <Text fontWeight={700} fontSize={"medium"} size={"sm"}>
                  nodecafe
                </Text>
              </HStack>
            </ChakraLink>

            <NodeSearchTypeahead />
          </HStack>
          {navigation.map((item) => (
            <Link key={item.name} href={item.href}>
              {item.name}
            </Link>
          ))}

          <Flex alignItems={"center"}>
            {session && (
              <Link key={"my_workflows"} href={"/my_workflows"}>
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  colorScheme={"teal"}
                  isActive={curPath === "/my_workflows"}
                >
                  {"My Workflows"}
                </Button>
              </Link>
            )}

            <IconButton
              variant={"ghost"}
              aria-label="Toggle light dark mode"
              icon={
                colorMode === "light" ? (
                  <IconMoon size={20} />
                ) : (
                  <IconSun size={21} />
                )
              }
              onClick={toggleColorMode}
            />
            <LoginButton />
          </Flex>
        </Flex>
      </nav>
    </header>
  );
}
