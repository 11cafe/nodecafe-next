import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import {
  MarkdownEditor,
  type MDXEditorMethods,
} from "../markdown-editor/MarkdownEditor";
import type { ComfyPackageCommentWithAuthor } from "@/pages/api/comments";

export default function Comments({ pkgId }: { pkgId: string }) {
  const markdownRef = useRef<MDXEditorMethods>(null);
  const { data: session } = useSession();
  const emailUsername = session?.user?.email?.split("@")?.at(0);
  const profileImage = session?.user?.image ?? undefined;
  const [comments, setComments] = useState<ComfyPackageCommentWithAuthor[]>([]);

  const getComments = async () => {
    const res = await fetch("/api/comments?pid=" + pkgId);
    const comments = await res.json();
    console.log(comments);
    setComments(comments);
  };

  useEffect(() => {
    getComments();
  }, []);

  const postComment = async () => {
    const content = markdownRef.current?.getMarkdown();
    if (!content) {
      return;
    }
    const res = await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({
        content,
        packageID: pkgId,
        authorID: session?.user?.id,
      }),
    });
    const newComment = await res.json();
    setComments([newComment, ...comments]);
    markdownRef.current?.setMarkdown("");
  };

  return (
    <Flex direction="column" mt={2}>
      <Heading size="md">Comments</Heading>
      <Text textColor={"grayText"} my={2}>
        Share your tips or tutorials about this node 🤗
      </Text>
      {session ? (
        <Flex align="center" my={2}>
          <Image
            boxSize="50px"
            borderRadius="full"
            src={profileImage}
            alt={emailUsername}
          />
          <Box ml={2} w={"100%"} border={"1px"} borderRadius={"md"}>
            <MarkdownEditor ref={markdownRef} />
            <Button onClick={postComment}>Comment</Button>
          </Box>
        </Flex>
      ) : (
        <Button size={"md"} onClick={() => signIn()} mt={4}>
          Login to comment
        </Button>
      )}
      <Stack spacing={3} mt={4}>
        {comments.map((comment, index) => (
          <Flex key={index} align="center">
            <Image
              boxSize="50px"
              borderRadius="full"
              src={comment.author?.imageUrl ?? ""}
              alt={comment.author?.username}
            />
            <Box ml={2}>
              <Text fontWeight="bold">{comment.author?.username}</Text>
              <ReactMarkdown className="mdx-editor">
                {comment.content}
              </ReactMarkdown>
              <Divider />
            </Box>
          </Flex>
        ))}
      </Stack>
    </Flex>
  );
}
