import { Workflow } from "@/server/dbTypes";
import { Box, Card, CardBody, Flex, Heading } from "@chakra-ui/react";
import Head from "next/head";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { GetServerSideProps, InferGetStaticPropsType } from "next/types";
import { dbTables } from "@/server/db-tables/dbTables";
import { formatTimestamp } from "@/utils/datatimeUtils";
import WorkflowCard from "@/components/WorkflowCard";

type Data = {
  workflows: Workflow[];
  error?: string;
};
export const getServerSideProps = (async ({ params, req, res }) => {
  const session = await getServerSession(req, res, authOptions);

  const userID = session?.user?.id;
  if (userID == null) {
    return { props: { data: { workflows: [], error: "Please login first" } } };
  }
  const workflows = await dbTables.cloudflow?.listByIndex(
    session?.user ?? null,
    "authorID",
    userID,
    "DESC",
    100,
  );

  return { props: { data: { workflows: workflows ?? [] } } };
}) satisfies GetServerSideProps<{
  data: Data;
}>;

export default function Page({
  data,
}: InferGetStaticPropsType<typeof getServerSideProps>) {
  return (
    <Box
      w={{ base: "100%", md: "95%" }}
      style={{ maxWidth: 1920, padding: 5 }}
      gap={6}
    >
      <Head>
        <title>My Workflows - Comfyspace</title>
        <meta
          name="description"
          content="ComfyUI Custom Nodes Wiki and directory"
        />
      </Head>
      <Flex gap={2} wrap={"wrap"}>
        {data.workflows.map((wf) => (
          <WorkflowCard key={wf.id} wf={wf} />
        ))}
      </Flex>
    </Box>
  );
}
