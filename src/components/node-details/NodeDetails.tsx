import { ComfyNode, NodeFolderPath } from "@/server/dbTypes";
import { Box, Grid, HStack, Heading, Stack, Tag, Text } from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import FolderIcon from "../folderIcon";
import { NODE_LIB_ORIGIN } from "@/utils/consts";

type Props = {
  node: ComfyNode;
};
export default function NodeDetails({ node }: Props) {
  const folderPaths = JSON.parse(node.folderPaths ?? "{}");
  const folderKeys = Object.keys(folderPaths);
  const nodeDefs = {
    [node.nodeType]: JSON.parse(node.nodeDef),
  };
  return (
    <Grid
      width={"100%"}
      templateRows={{ base: "repeat(2, auto)", md: "1fr" }}
      templateColumns={{ md: "1fr 40%" }}
      templateAreas={{
        base: `
            "sidebar"
            "main"
          `,
        md: `
            "main sidebar"
          `,
      }}
      gap={4}
    >
      <Head>
        <title>{node.id} - ComfyUI node</title>
        <meta
          name="description"
          content="ComfyUI Custom Nodes Wiki and Pacakge Library"
        />
      </Head>
      <Box p={4} gridArea="main">
        <iframe
          src={
            `${NODE_LIB_ORIGIN}?packageID=${node.packageID}&node=` +
            node.nodeType
          }
          width="100%"
          height={`500px`}
        ></iframe>
      </Box>
      <Box p={4} gridArea="sidebar" width={{ base: "100%", md: "auto" }}>
        <Stack gap={5}>
          <Heading size={"md"}>{node.nodeType}</Heading>
          <Box>
            <Heading size={"sm"} py={2}>
              Package
            </Heading>
            <Link href={"/package/" + node.packageID}>
              {"nodecafe.org/pacakage/" + node.packageID}
            </Link>
          </Box>
          {folderKeys.length && (
            <Box>
              <Heading size={"sm"} py={2}>
                Model installation paths
              </Heading>
              <Stack overflow={"hidden"}>
                {folderKeys.map((key) => {
                  const val: NodeFolderPath = folderPaths[key];
                  return (
                    <Box overflow={"hidden"} key={key}>
                      <Tag>{key}</Tag>
                      <HStack>
                        <Box flexShrink={0}>
                          <FolderIcon />
                        </Box>
                        <Text flexShrink={0}>{val.folder_name}</Text>
                      </HStack>
                      {val.abs_path?.[1] && (
                        <Text>Accept: {val.abs_path[1].join(", ")}</Text>
                      )}
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          )}
        </Stack>
      </Box>
    </Grid>
  );
}
