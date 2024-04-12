import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import type { NodePackage } from "@/server/dbTypes";
import {
  Flex,
  Tag,
  Link as ChakraLink,
  Grid,
  Box,
  HStack,
} from "@chakra-ui/react";
import { dbTables } from "@/server/db-tables/dbTables";
import NodePackageCard from "@/components/NodePackageCard";
import RequestNodeDialog from "@/components/package-details/RequestNodeDialog";

type Data = {
  popular: (NodePackage & { nodes: string[]; totalNodes: number })[];
  failed: (NodePackage & { nodes: string[]; totalNodes: number })[];
  nextToken?: string | null;
};
export const getStaticProps = (async (context) => {
  const MAX_NODES = 5;
  const popularPackages = await dbTables.nodePackage?.homePopularList(50);
  const failedPackages = await dbTables.nodePackage?.homeImportFailedList(6);
  const popular = popularPackages?.map(async (pack) => {
    const node_names =
      (await dbTables.node
        ?.listByIndex(null, "packageID", pack.id)
        .then((nodes) => {
          return nodes.map((n) => n.id);
        })) ?? [];
    return {
      ...pack,
      nodes: node_names.slice(0, MAX_NODES),
      // totalNodes: node_names.length,
    };
  });
  const failed = failedPackages?.map(async (pack) => {
    const node_names =
      (await dbTables.node
        ?.listByIndex(null, "packageID", pack.id)
        .then((nodes) => {
          return nodes.map((n) => n.id);
        })) ?? [];
    return {
      ...pack,
      nodes: node_names.slice(0, MAX_NODES),
      // totalNodes: node_names.length,
    };
  });
  const popularItems = await Promise.all(popular ?? []);
  const failedItems = await Promise.all(failed ?? []);

  return { props: { data: { popular: popularItems, failed: failedItems } } };
}) satisfies GetStaticProps<{
  data: Data;
}>;

export default function Page({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Flex
      direction="column"
      w={{ base: "100%", md: "95%" }}
      style={{ maxWidth: 1600, padding: 5 }}
      gap={10}
    >
      <Head>
        <title>Nodecafe - ComfyUI Custom Nodes Library and Wiki</title>
        <meta
          name="description"
          content="ComfyUI Custom Nodes Wiki and directory"
        />
      </Head>
      <Grid
        templateRows={{ base: "repeat(2, auto)", md: "1fr" }}
        templateColumns={{ md: "1fr 30%" }}
        templateAreas={{
          base: `
          "main"
          "sidebar"
        `,
          md: `
          "main sidebar"
        `,
        }}
        gap={4}
      >
        <Box alignItems={"start"} p={4} gridArea="main" maxWidth={"900px"}>
          <HStack justifyContent={"space-between"} alignItems={"center"} mb={6}>
            <Tag borderRadius={12} size={"lg"}>
              🌟 Popular
            </Tag>
            {/* <RequestNodeDialog /> */}
          </HStack>
          {data.popular.map((pkg, index) => (
            <NodePackageCard pkg={pkg} key={pkg.id} rank={index} />
          ))}
        </Box>
        <Box p={4} gridArea="sidebar" width={{ base: "100%" }}>
          <Tag borderRadius={12} size={"lg"} mb={6}>
            🚦 Failing install
          </Tag>
          {data.failed.map((pkg) => (
            <NodePackageCard pkg={pkg} key={pkg.id} />
          ))}
        </Box>
      </Grid>
    </Flex>
  );
}
