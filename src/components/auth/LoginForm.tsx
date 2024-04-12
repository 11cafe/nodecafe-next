import { signIn, useSession } from "next-auth/react";
import { Button, Stack } from "@chakra-ui/react";
import { IconBrandGithub, IconBrandGoogleFilled } from "@tabler/icons-react";
const BUTTON_WIDTH = "300px";

export default function LoginForm() {
  const { data: session } = useSession();
  if (session) {
    const emailUsername = session.user?.email?.split("@")?.at(0);
    return (
      <Stack>
        <span>
          Already logged in as <b>{emailUsername}</b>
        </span>
      </Stack>
    );
  }
  return (
    <Stack>
      <Button
        key={"google"}
        onClick={() =>
          window.open(
            "/auth/signin?google=true",
            "Login",
            "width=800,height=600",
          )
        }
        leftIcon={<IconBrandGoogleFilled size={20} />}
        backgroundColor={"#CC5541"}
        colorScheme="red"
        color={"white"}
      >
        Continue with Google
      </Button>
      <Button
        key={"github"}
        onClick={() => {
          window.open(
            "/auth/signin?github=true",
            "Login",
            "width=800,height=600",
          );
        }}
        leftIcon={<IconBrandGithub size={20} />}
      >
        Continue with Github
      </Button>
    </Stack>
  );
}
