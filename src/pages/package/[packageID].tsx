import {} from "aws-amplify/api/server";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { ComfyNode, NodePackage } from "@/server/dbTypes";
import {
  Text,
  Flex,
  HStack,
  Heading,
  Link as ChakraLink,
  useToast,
} from "@chakra-ui/react";
import { gitUsernameFromGitUrl } from "@/utils/packageUtils";
import { IconBrandGithub } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { OnClickNodeEvent, UpdateCanvasHeight } from "@/types/eventTypes";
import NodeDetailsModal from "@/components/node-details/NodeDetailsModal";
import PackageDetailsCols from "@/components/package-details/PackageDetailsCols";
import { dbTables } from "@/server/db-tables/dbTables";
import { useRouter } from "next/router";
import { ApiResponse } from "@/types/ApiTypes";
import { NODE_ID_SPLITTER } from "@/utils/consts";

type Data = {
  nodePack: (NodePackage & { nodes: ComfyNode[] }) | null;
};
// This function gets called at build time
export async function getStaticPaths() {
  const packages = await dbTables.nodePackage?.listAll(1000);
  // Get the paths we want to pre-render based on posts
  const paths =
    packages?.items.map((p) => ({
      params: { packageID: p.id },
    })) ?? [];

  return { paths, fallback: "blocking" };
}
// This also gets called at build time
export const getStaticProps = (async ({ params }) => {
  if (params == null) {
    throw new Error("params is null");
  }
  const nodePack = await dbTables.nodePackage?.get(params.packageID as string);
  if (nodePack == null) {
    return { props: { data: { nodePack: null } } };
  }
  const nodes =
    (await dbTables.node?.listByIndex(
      null,
      "packageID",
      nodePack.id,
      undefined,
      1000,
    )) ?? [];
  const nodePackWithNodes = {
    ...nodePack,
    nodes: nodes,
  };
  return { props: { data: { nodePack: nodePackWithNodes } } };
}) satisfies GetStaticProps<{
  data: Data;
}>;

export default function Page({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const pkg = data.nodePack;
  const [showNode, setShowNode] = useState<ComfyNode | null>(null);
  const router = useRouter();
  const nodeType = router.query.node as string;
  const toast = useToast();
  useEffect(() => {
    async function fetchNodeData() {
      const data = await fetch(
        `/api/getNode?id=${encodeURIComponent(nodeType) + NODE_ID_SPLITTER + pkg?.id}`,
      );
      const resp = (await data.json()) as ApiResponse<ComfyNode | null>;
      if (resp.data) {
        setShowNode(resp.data);
      } else {
        setShowNode(null);
        toast({
          title: `Node not found <${nodeType}> in package <${pkg?.id}>`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
    if (nodeType) {
      fetchNodeData();
    }
  }, [nodeType]);

  useEffect(() => {
    window.addEventListener(
      "message",
      function (event: MessageEvent<OnClickNodeEvent>) {
        if (event.origin !== window.location.origin) {
          return;
        }
        if (event.data.type === "onClickNodeEvent") {
          const node = pkg?.nodes.find((n) => {
            return (
              n.nodeType === event.data.nodeType || n.id === event.data.nodeType
            );
          });
          setShowNode(node || null);
        }
      },
      false,
    );
  }, []);

  if (pkg == null) {
    return <div>Node Package not found</div>;
  }

  return (
    <Flex
      direction="column"
      w={{ base: "100%", md: "95%" }}
      style={{ padding: 5 }}
      gap={6}
    >
      <Head>
        <title>
          {pkg.nameID} - ComfyUI Custom Nodes Wiki and Pacakge Library
        </title>
        <meta
          name="description"
          content="ComfyUI Custom Nodes Wiki and directory"
        />
      </Head>

      <HStack>
        <Heading size={"lg"} mr={20}>
          {pkg.nameID}
        </Heading>
        <ChakraLink href={"https://github.com/" + pkg.gitRepo} isExternal>
          <HStack>
            <IconBrandGithub size={20} />

            <Text color={"GrayText"}>{gitUsernameFromGitUrl(pkg.gitRepo)}</Text>
            {/* <IconStar size={20} color="#DBB556" /> */}
            <Text color={"GrayText"}>⭐️{pkg.totalStars} </Text>
          </HStack>
        </ChakraLink>
      </HStack>
      <PackageDetailsCols pkg={pkg} />
      {showNode && (
        <NodeDetailsModal
          onClose={() => {
            setShowNode(null);
            const url = new URL(window.location.href);
            url.searchParams.delete("node");
            history.pushState(null, "", url);
          }}
          node={showNode}
        />
      )}
    </Flex>
  );
}
