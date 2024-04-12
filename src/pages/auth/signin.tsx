import { signIn, useSession } from "next-auth/react";
import { Button, Stack } from "@chakra-ui/react";
import { IconBrandGithub, IconBrandGoogleFilled } from "@tabler/icons-react";
import { useEffect, useState } from "react";

const BUTTON_WIDTH = "300px";
export default function SignIn({}) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (status === "loading") {
      return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    if (session) {
      setIsLoading(false);
      if (urlParams.get("callbackUrl")) {
        window.location.href = urlParams.get("callbackUrl") as string;
      } else {
        window.close();
      }

      return;
    }
    const isGithub = urlParams.get("github") ?? "";
    if (isGithub === "true") {
      signIn("github");
      setIsLoading(true);
      return;
    }
    const isGoogle = urlParams.get("google") ?? "";
    if (isGoogle === "true") {
      signIn("google");
      setIsLoading(true);
      return;
    }
  }, [session, status]);
  if (isLoading) {
    return (
      <Stack>
        <span>Logging in...</span>
      </Stack>
    );
  }
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
    <Stack gap={3}>
      <Button
        width={BUTTON_WIDTH}
        key={"google"}
        onClick={() => signIn("google")}
        leftIcon={<IconBrandGoogleFilled size={20} />}
        backgroundColor={"#CC5541"}
        colorScheme="red"
        color={"white"}
      >
        Continue with Google
      </Button>

      <Button
        width={BUTTON_WIDTH}
        key={"github"}
        onClick={() => signIn("github")}
        leftIcon={<IconBrandGithub size={20} />}
        backgroundColor={"#333"}
        color={"white"}
      >
        Continue with Github
      </Button>
    </Stack>
  );
}

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const session = await getSession(context);

//   if (session) {
//     return {
//       redirect: {
//         destination: (context?.query?.callbackUrl as string) || "/",
//         permanent: false,
//       },
//     };
//   }
//   return {
//     props: {},
//   };
// }
