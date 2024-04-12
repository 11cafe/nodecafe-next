import { Button, HStack, Heading } from "@chakra-ui/react";
import WorkflowDetailsCols from "./WorkflowDetailsCols";
import { Workflow, WorkflowVersion } from "@/server/dbTypes";
import PrivacyLabel from "./PrivacyLabel";
import { useEffect, useState } from "react";
import { ListWorkflowVersionsByWorkflowIDResponse } from "@/pages/api/listWorkflowVersionsByWorkflowID";
import OpenInComfyuiButton from "./components/openInComfyuiButton";
import Settings from "./components/settings";
import MoreActionMenu from "./components/moreActionMenu";
import { useSession } from "next-auth/react";
import AuthorName from "./components/AuthorName";

type Props = {
  workflow: Workflow;
  version: WorkflowVersion | null;
};
export default function WorkflowDetails({ workflow, version }: Props) {
  const [versions, setVersions] = useState<WorkflowVersion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession();
  const loadWorkflowVersions = async () => {
    setLoading(true);
    const resp = await fetch(
      "/api/listWorkflowVersionsByWorkflowID?workflowID=" + workflow.id,
    );
    const jsonResp =
      (await resp.json()) as ListWorkflowVersionsByWorkflowIDResponse;
    setVersions(jsonResp.items ?? []);
    setLoading(false);
  };
  useEffect(() => {
    loadWorkflowVersions();
  }, []);
  const latestVersion = version ?? versions?.at(0);
  const isOwner = workflow.authorID === session?.user.id;
  return (
    <>
      <HStack alignItems={"center"} gap={4}>
        <Heading size="lg" maxWidth={"40vw"}>
          {workflow.name}
        </Heading>
        <PrivacyLabel privacy={workflow.privacy} />
        <AuthorName authorID={workflow.authorID} />
        <OpenInComfyuiButton
          workflow={workflow}
          version={latestVersion ?? null}
        />
        {isOwner && (
          <>
            <Settings workflow={workflow} />
            <MoreActionMenu workflowId={workflow.id} />
          </>
        )}
      </HStack>
      <WorkflowDetailsCols
        version={latestVersion ?? null}
        workflow={workflow}
        versions={versions}
        loading={loading}
      />
    </>
  );
}
