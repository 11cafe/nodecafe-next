import { ComfyUser } from "@/server/dbTypes";
import { ApiResponse } from "@/types/ApiTypes";
import { HStack, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const PROFILE_IMAGE_SIZE = 20;
export default function AuthorName({ authorID }: { authorID: string }) {
  const [user, setUser] = useState<ComfyUser | null>(null);
  useEffect(() => {
    const loadAuthor = async () => {
      const resp = await fetch("/api/user/getUser?id=" + authorID);
      const jsonResp = (await resp.json()) as ApiResponse<ComfyUser | null>;
      setUser(jsonResp.data ?? null);
    };

    loadAuthor();
  }, []);

  if (!user) return null;
  return (
    <HStack>
      {user.imageUrl && (
        <Image
          width={"20px"}
          src={user.imageUrl}
          alt={"profile image"}
          borderRadius={PROFILE_IMAGE_SIZE / 2}
        />
      )}
      <span> {user.username}</span>
    </HStack>
  );
}
