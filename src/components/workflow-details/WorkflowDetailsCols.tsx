import { Workflow, WorkflowVersion } from "@/server/dbTypes";
import { handleDownloadJson } from "@/utils/fileUtils";
import {
  Box,
  Button,
  Heading,
  Stack,
  Text,
  Link as ChakraLink,
  Grid,
  Spinner,
  Flex,
  useToast,
  Tooltip,
  Tag,
} from "@chakra-ui/react";
import { IconCopy, IconDownload } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import WorkflowDetailsColsVersionList from "./components/WorkflowDetailsColsVersionList";
import WorkflowDetailsColsModelsList from "./components/WorkflowDetailsColsModelsList";
import { getDepsFromWorkflowJson } from "@/utils/workflowUtils";
import WorkflowDetailsColsNodePackageList from "./components/WorkflowDetailsColsNodePackageList";

type Props = {
  version: WorkflowVersion | null;
  versions: WorkflowVersion[];
  workflow: Workflow;
  loading: boolean;
};

export default function WorkflowDetailsCols({
  version,
  workflow,
  versions,
  loading,
}: Props) {
  const toast = useToast();
  const [canvasFullscreen, setCanvasFullscreen] = useState<boolean>(false);

  const onClickDownload = () => {
    const json = version?.json;
    const parsed = JSON.parse(json ?? "{}");
    const prettyJson = JSON.stringify(parsed, null, 2);
    const name = workflow.name;
    const verName = version?.name ?? "";
    json && handleDownloadJson(prettyJson, name + "_" + verName);
  };

  const onClickCopy = () => {
    version?.json &&
      navigator.clipboard
        .writeText(version?.json)
        .then(() => {
          toast({
            title: "Copied to clipboard",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
  };

  const nodeDefObj = JSON.parse(version?.nodeDefs ?? "{}");
  const nodes = Object.keys(nodeDefObj);
  if (loading) return <Spinner />;
  if (!version) return null;
  const deps = getDepsFromWorkflowJson(version?.json ?? "{}");

  return (
    <Grid
      templateRows={{ base: "repeat(2, auto)", md: "1fr" }}
      templateColumns={{ md: "1fr 30%" }}
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
      <Box p={4} gridArea="main">
        <Stack flexGrow={1}>
          <Box
            position="relative"
            width="100%"
            zIndex={100}
            style={
              canvasFullscreen
                ? { position: "fixed", top: 0, bottom: 0, left: 0, right: 0 }
                : { height: "500px" }
            }
          >
            <iframe
              src={"/web/index.html?workflowVersionID=" + version.id}
              width="100%"
              height="100%"
            ></iframe>
            <Button
              position="absolute"
              size={"sm"}
              bottom="0"
              right="0"
              colorScheme="teal"
              onClick={() => {
                setCanvasFullscreen(!canvasFullscreen);
              }}
            >
              {canvasFullscreen ? "Close" : "Full screen"}
            </Button>
          </Box>
        </Stack>
      </Box>
      <Box p={4} gridArea="sidebar" width={{ base: "100%", md: "auto" }}>
        <Stack gap={5}>
          <Flex gap={3}>
            <Button
              size={"sm"}
              leftIcon={<IconDownload />}
              onClick={onClickDownload}
            >
              Download
            </Button>
            <Button size={"sm"} leftIcon={<IconCopy />} onClick={onClickCopy}>
              Copy Json
            </Button>
          </Flex>
          {deps && (
            <Tooltip label="All resource download links like models, custom nodes and images are included in this workflow json.">
              <Tag
                colorScheme="teal"
                width={"fit-content"}
                borderRadius={"full"}
              >
                🔮Workspace Included
              </Tag>
            </Tooltip>
          )}
          <WorkflowDetailsColsVersionList
            version={version}
            versions={versions}
            workflow={workflow}
          />

          <WorkflowDetailsColsModelsList
            version={version}
            workflow={workflow}
          />
          <WorkflowDetailsColsNodePackageList
            version={version}
            workflow={workflow}
          />

          <Stack>
            <Heading size={"sm"}>Nodes ({nodes.length})</Heading>

            {nodes.map((node) => (
              <Link
                href={`/node?type=${encodeURIComponent(node)}`}
                key={node}
                target="_blank"
              >
                {node}
              </Link>
            ))}
          </Stack>
        </Stack>
      </Box>
    </Grid>
  );
}
