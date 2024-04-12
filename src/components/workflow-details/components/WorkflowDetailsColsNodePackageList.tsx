import { DepsResult } from "@/consts/types";
import type { Workflow, WorkflowVersion } from "@/server/dbTypes";
import { getDepsFromWorkflowJson } from "@/utils/workflowUtils";
import { Heading, Stack, HStack, Link } from "@chakra-ui/react";

export default function WorkflowDetailsColsNodePackageList({
  workflow,
  version,
}: {
  workflow: Workflow;
  version: WorkflowVersion | null;
}) {
  const deps = getDepsFromWorkflowJson(version?.json ?? "{}");
  const nodeRepos: DepsResult["nodeRepos"] | null = deps?.nodeRepos ?? null;
  if (!nodeRepos) {
    return null;
  }

  return (
    <Stack>
      <Heading size={"sm"}>Custom Nodes</Heading>
      {nodeRepos.map((repo) => {
        return (
          <HStack key={repo.gitRepo} justifyContent={"space-between"}>
            <Link
              size={"sm"}
              target="_blank"
              href={"https://github.com/" + repo.gitRepo}
              wordBreak={"break-all"}
            >
              {repo.gitRepo}
            </Link>
          </HStack>
        );
      })}
    </Stack>
  );
}
