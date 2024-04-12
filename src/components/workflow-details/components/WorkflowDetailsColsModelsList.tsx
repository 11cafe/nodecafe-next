import { DepsResult } from "@/consts/types";
import type { Workflow, WorkflowVersion } from "@/server/dbTypes";
import { getDepsFromWorkflowJson } from "@/utils/workflowUtils";
import {
  Heading,
  Stack,
  Button,
  HStack,
  Tag,
  Link,
  IconButton,
} from "@chakra-ui/react";
import { IconDownload } from "@tabler/icons-react";

export default function WorkflowDetailsColsModelsList({
  workflow,
  version,
}: {
  workflow: Workflow;
  version: WorkflowVersion | null;
}) {
  const deps = getDepsFromWorkflowJson(version?.json ?? "{}");
  const modelDeps: DepsResult["models"] | null = deps?.models ?? null;
  if (!modelDeps) {
    return null;
  }

  return (
    <Stack>
      <Heading size={"sm"}>Models</Heading>
      {Object.values(modelDeps)?.map((model) => {
        return (
          <HStack key={model.filename}>
            <Tag size={"md"}>{model.fileFolder}</Tag>
            <Link
              size={"sm"}
              target="_blank"
              href={model.infoUrl || "#"}
              wordBreak={"break-all"}
            >
              {model.filename}
            </Link>
            {model.downloadUrl && (
              <a
                href={model.downloadUrl || "#"}
                rel="noopener noreferrer"
                style={{ textDecoration: "none", display: "block" }}
              >
                <IconButton
                  aria-label="download model"
                  size={"sm"}
                  icon={<IconDownload size={19} />}
                  onClick={() => window.open("")}
                />
              </a>
            )}
          </HStack>
        );
      })}
    </Stack>
  );
}
