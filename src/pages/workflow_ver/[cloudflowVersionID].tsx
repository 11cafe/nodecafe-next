import type { GetServerSideProps, InferGetStaticPropsType } from "next";
import { Workflow, WorkflowVersion } from "@/server/dbTypes";
import { dbTables } from "@/server/db-tables/dbTables";
import { Flex } from "@chakra-ui/react";
import Head from "next/head";
import WorkflowDetails from "@/components/workflow-details/WorkflowDetails";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";

type Data = {
  flowVer: WorkflowVersion | null;
  cloudflow: Workflow | null;
};
export const getServerSideProps = (async ({ params, req, res }) => {
  if (params == null) {
    throw new Error("params is null");
  }
  const session = await getServerSession(req, res, authOptions);

  const versionID = params.cloudflowVersionID as string;
  console.log("versionID", versionID);
  const flowID = versionID.split("/")[0];
  const [flowVer, cloudflow] = await Promise.all([
    dbTables.cloudflowVersion?.get(versionID as string, session?.user) ?? null,
    dbTables.cloudflow?.get(flowID, session?.user) ?? null,
  ]);

  return { props: { data: { flowVer, cloudflow } } };
}) satisfies GetServerSideProps<{
  data: Data;
}>;

export default function Page({
  data,
}: InferGetStaticPropsType<typeof getServerSideProps>) {
  if (data.cloudflow == null) {
    return <div>Workflow not found or you do not have access to it</div>;
  }
  if (data.flowVer == null) {
    return <div>Workflow Version not found</div>;
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
          {data.cloudflow.name} - {data.flowVer.name} - Comfyspace ComfyUI
          Workflow
        </title>

        <meta
          name="description"
          content="ComfyUI Custom Nodes Wiki and directory"
        />
      </Head>
      <WorkflowDetails workflow={data.cloudflow} version={data.flowVer} />
    </Flex>
  );
}
