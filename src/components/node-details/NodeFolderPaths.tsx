import { ComfyNode, NodeFolderPath } from "@/server/dbTypes";
import { Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

type Props = {
  node: ComfyNode;
};
export default function NodeFolderPaths({ node }: Props) {
  const [folderPaths, setFolderPaths] = useState<Record<
    string,
    NodeFolderPath
  > | null>(null);

  useEffect(() => {
    if (node.folderPaths == null) {
      return;
    }
    try {
      const paths = JSON.parse(node.folderPaths);
      setFolderPaths(paths);
    } catch (e) {
      console.error("error parsing folder path", e);
    }
  }, [node.folderPaths]);
  if (folderPaths == null) {
    return null;
  }

  const modelFields = Object.keys(folderPaths);

  return (
    <Stack>
      <Text>Model installation folders</Text>
      {modelFields.map((arg) => (
        <Stack key={arg}>
          <Text>{arg}</Text>
          <Text>{folderPaths[arg].abs_path}</Text>
        </Stack>
      ))}
    </Stack>
  );
}
