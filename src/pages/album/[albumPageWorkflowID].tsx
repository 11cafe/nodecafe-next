import {
  Flex,
  Heading,
  SimpleGrid,
  Image,
  Container,
  Box,
  Stack,
  Input,
} from "@chakra-ui/react";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";
import Head from "next/head";
// import Image from "next/image";

import Carousel from "./Carousel";
interface Album {
  id: string;
  name: string;
  ownerId: string;
  isPublic: boolean;
  images: string[];
  // Add other album properties as needed
}

export const getServerSideProps = (async () => {
  // Fetch data from external API
  // const res = await fetch("https://api.github.com/repos/vercel/next.js");
  // const album: Album = await res.json();

  const album: Album = {
    id: "23444",
    name: "Animate diff prompt travel",
    ownerId: "1234",
    isPublic: true,
    images: [],
  };
  return { props: { album } };
}) satisfies GetServerSideProps<{ album: Album | null; error?: string }>;

export default function Page({
  album,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const images = [
    "https://cdn.openart.ai/workflow_thumbnails/4pYEgRw3JXVFu5elJKeR/image_8v6AdCia_1703246910524_raw.jpg",
    "https://cdn.openart.ai/workflow_thumbnails/hiYA6oNQH6naSngy4TMN/image_RY5vEsDT_1704318630953_raw.jpg",
    "https://cdn.openart.ai/workflow_thumbnails/hiYA6oNQH6naSngy4TMN/image_2TFQSMWc_1704318636141_raw.jpg",
    "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/a5d866f6-f39f-4935-bbdd-30428b74f769/original=true/00105-1063812522.jpeg",
    "https://cdn.openart.ai/workflow_thumbnails/HsZqLm2SYKuVwJpYzqmN/gif_JN0RYKNx_1704463404238_raw.gif",
  ];
  return (
    <Flex
      direction="column"
      w={{ base: "100%", md: "95%" }}
      style={{ maxWidth: 1400, padding: 5 }}
      gap={6}
    >
      <Head>
        <title>ComfyUI Gallery - {album.name}</title>
        <meta
          name="description"
          content={"AUTO111's gallery of " + album.name}
        />
      </Head>
      <Heading size={"lg"}>{album.name}</Heading>
      <Flex gap={3}>
        <Flex width={"50%"}>
          <Carousel
            media={images.map((im, index) => {
              return {
                id: index + " ",
                imageUrl: im,
              };
            })}
          />
        </Flex>
        <Stack width={"50%"}>
          <Input placeholder="Prompt" />
        </Stack>
      </Flex>
      <SimpleGrid columns={[3, null, 4]} spacing="4px">
        {images.map((im, index) => {
          return (
            <Image
              key={index}
              src={im}
              alt={index + " "}
              width={270}
              height={270}
              style={{ borderRadius: 6 }}
              objectFit={"cover"}
              aspectRatio={1}
            />
          );
        })}
      </SimpleGrid>
    </Flex>
  );
}
