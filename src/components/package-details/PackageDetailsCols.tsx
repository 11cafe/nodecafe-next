import { ComfyNode, NodePackage } from "@/server/dbTypes";
import { UpdateCanvasHeight } from "@/types/eventTypes";
import {
  Box,
  Button,
  HStack,
  Heading,
  Stack,
  Text,
  Link as ChakraLink,
  Grid,
} from "@chakra-ui/react";
import { IconBrandGithub, IconInfoCircle } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import Comments from "./Comments";
import { useRouter } from "next/router";
import { NODE_LIB_ORIGIN } from "@/utils/consts";
import PackageStatus from "./PackageStatus";
import ErrorAlert from "./ErrorAlert";
import NodesWithFolderPathList from "./NodesWithFolderPathList";
import { PackageImportTime } from "./PackageImportTime";
import RelatedWorkflows from "./RelatedWorkflows";
import PackageVersionSelector from "./PackageVersionSelector";

type Props = {
  pkg: (NodePackage & { nodes: ComfyNode[] }) | null;
};
const RIGHT_COLUMN_WIDTH_PERCENT = 30;
const CANVAS_DEFAULT_HEIGHT = 800;
const MAX_NODE_COUNT = 10;

export default function PackageDetailsCols({ pkg }: Props) {
  const [canvasHeight, setCanvasHeight] = useState<number>(
    CANVAS_DEFAULT_HEIGHT,
  );
  const [canvasShowAll, setCanvasShowAll] = useState<boolean>(false);
  const totalCanvasHeight = useRef<number>();
  const router = useRouter();
  const [showAllNodes, setShowAllNodes] = useState<boolean>(false);

  useEffect(() => {
    // Event handler for updating canvas height
    window.addEventListener(
      "message",
      function (event: MessageEvent<UpdateCanvasHeight>) {
        if (event.origin !== window.location.origin) {
          return; // Ignore cross origin message
        }

        if (event.data.type === "updateCanvasHeight") {
          totalCanvasHeight.current = event.data.height;
        }
      },
      false,
    );
  }, []);

  if (pkg == null) {
    return null;
  }
  const nodeLength = pkg.nodes.length;

  return (
    <Grid
      templateRows={{ base: "repeat(2, auto)", md: "1fr" }}
      templateColumns={{ md: "1fr 36%" }}
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
      <Box p={4} gridArea="main">
        <Stack flexGrow={1} gap={10}>
          <Box
            style={
              canvasShowAll
                ? {
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }
                : {
                    position: "relative",
                    width: "100%",
                    height: "80vh",
                  }
            }
          >
            <iframe
              src={`${NODE_LIB_ORIGIN}?packageID=` + pkg.id}
              width="100%"
              height="100%"
            ></iframe>
            <Button
              position="absolute"
              size={"sm"}
              bottom="4"
              right="0"
              colorScheme="teal"
              onClick={() => {
                // setCanvasShowAll(!canvasShowAll);
                window.location.href = `${NODE_LIB_ORIGIN}?packageID=` + pkg.id;
              }}
            >
              {canvasShowAll ? "Show less" : "Show all " + pkg.totalNodes}
            </Button>
          </Box>
          <RelatedWorkflows gitRepo={pkg.gitRepo} />
          <Comments pkgId={pkg.id} />
        </Stack>
      </Box>
      <Box p={4} gridArea="sidebar" width={{ base: "100%", md: "auto" }}>
        <Stack gap={5}>
          <Stack>
            <HStack gap={1}>
              <IconBrandGithub />
              <ChakraLink
                isExternal
                href={"https://github.com/" + pkg.gitRepo}
                fontSize={18}
                fontWeight={"500"}
              >
                github.com/{pkg.gitRepo}
              </ChakraLink>
            </HStack>
          </Stack>

          <Text>{pkg.description}</Text>
          {pkg.latestCommit && <PackageVersionSelector pkg={pkg} />}

          <PackageStatus pkg={pkg} />

          <ErrorAlert pkg={pkg} />
          <PackageImportTime pkg={pkg} />
          <NodesWithFolderPathList nodes={pkg.nodes} />

          <Stack>
            <Heading size={"sm"}>Nodes ({pkg.totalNodes})</Heading>

            {pkg.nodes
              .slice(0, showAllNodes ? undefined : MAX_NODE_COUNT)
              .map((node) => (
                <div key={node.id}>
                  <Text
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      router.push(
                        `/package/${pkg.id}?node=${encodeURIComponent(node.nodeType)}`,
                        undefined,
                        { shallow: true },
                      );
                    }}
                  >
                    {node.nodeType}
                  </Text>
                </div>
              ))}
            <Button
              size={"sm"}
              onClick={() => setShowAllNodes(!showAllNodes)}
              maxWidth={60}
            >
              {showAllNodes ? "Show less" : `Show all ${pkg.totalNodes}`}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Grid>
  );
}
