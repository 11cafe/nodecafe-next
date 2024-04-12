import { Button, HStack, Image } from "@chakra-ui/react";
import { ErrorBoundary } from "react-error-boundary";
import { useSession, signIn, signOut } from "next-auth/react";

const PROFILE_IMAGE_SIZE = 20;
export default function LoginButton() {
  const { data: session } = useSession();
  if (session) {
    const emailUsername = session.user?.email?.split("@")?.at(0);
    const profileImage = session.user?.image;
    return (
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <HStack>
          {profileImage && (
            <Image
              width={"20px"}
              src={profileImage}
              alt={emailUsername}
              borderRadius={PROFILE_IMAGE_SIZE / 2}
            />
          )}
          <span> {emailUsername}</span>
          <button onClick={() => signOut()}>Log out</button>
        </HStack>
      </ErrorBoundary>
    );
  }
  return (
    <>
      <Button size={"sm"} variant={"ghost"} onClick={() => signIn()}>
        Login
      </Button>
    </>
  );
}
