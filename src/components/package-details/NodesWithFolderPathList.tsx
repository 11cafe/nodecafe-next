import { ComfyNode, NodeFolderPath } from "@/server/dbTypes";
import {
  Box,
  HStack,
  Heading,
  Stack,
  Tag,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useState } from "react";
import FolderIcon from "../folderIcon";

export default function NodesWithFolderPathList({
  nodes,
}: {
  nodes: ComfyNode[];
}) {
  const filtered = nodes.filter((node) => {
    return !!node.folderPaths;
  });
  if (!filtered.length) {
    return null;
  }
  return (
    <Stack>
      <Heading size={"sm"}>Model paths</Heading>
      {filtered
        .filter((node) => node.folderPaths?.length)
        .map((node) => {
          const folderPaths = JSON.parse(node.folderPaths ?? "{}");
          return (
            <Stack overflow={"hidden"} key={node.id}>
              <Text>{node.nodeType}</Text>
              {Object.keys(folderPaths).map((key) => {
                const val: NodeFolderPath = folderPaths[key];
                return (
                  <Box overflow={"hidden"} key={key} ml={3}>
                    <HStack flexWrap={"wrap"}>
                      <Tag>{key}</Tag>
                      <HStack>
                        <Box flexShrink={0}>
                          <FolderIcon />
                        </Box>
                        <Tooltip label={val.abs_path?.[0]}>
                          <Text flexShrink={0}>{val.folder_name}</Text>
                        </Tooltip>
                      </HStack>
                    </HStack>
                  </Box>
                );
              })}
            </Stack>
          );
        })}
    </Stack>
  );
}
