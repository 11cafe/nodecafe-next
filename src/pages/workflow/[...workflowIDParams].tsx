import {} from "aws-amplify/api/server";
import type { GetServerSideProps, InferGetStaticPropsType } from "next";
import { Workflow, WorkflowVersion } from "@/server/dbTypes";
import { dbTables } from "@/server/db-tables/dbTables";
import { Flex } from "@chakra-ui/react";
import Head from "next/head";
import WorkflowDetails from "@/components/workflow-details/WorkflowDetails";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";

type Data = {
  workflow: Workflow | null;
  version: WorkflowVersion | null;
};
export const getServerSideProps = (async ({ params, req, res }) => {
  if (params == null) {
    throw new Error("params is null");
  }
  const session = await getServerSession(req, res, authOptions);
  const segments = params.workflowIDParams as string[];
  const workflowID = segments[0];
  const versionID = segments[1];
  const [workflow, version] = await Promise.all([
    dbTables.cloudflow?.get(workflowID, session?.user) ?? null,
    versionID
      ? dbTables.cloudflowVersion?.get(versionID as string, session?.user) ??
        null
      : null,
  ]);
  return { props: { data: { workflow, version } } };
}) satisfies GetServerSideProps<{
  data: Data;
}>;

export default function Page({
  data,
}: InferGetStaticPropsType<typeof getServerSideProps>) {
  if (data.workflow == null) {
    return <div>Workflow not found or you do not have access to it</div>;
  }
  return (
    <Flex
      direction="column"
      w={{ base: "100%", md: "95%" }}
      style={{ padding: 5 }}
      gap={6}
    >
      <Head>
        <title>{data.workflow.name} - Comfyspace ComfyUI Workflow</title>
      </Head>
      <WorkflowDetails workflow={data.workflow} version={data.version} />
    </Flex>
  );
}
