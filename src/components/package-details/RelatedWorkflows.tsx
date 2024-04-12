import { Box, Flex, Heading, SimpleGrid } from "@chakra-ui/react";
import WorkflowCard from "../WorkflowCard";
import { useEffect, useState } from "react";
import { Workflow } from "@/server/dbTypes";

export default function RelatedWorkflows({ gitRepo }: { gitRepo: string }) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);

  useEffect(() => {
    // fetch related workflows
    const fetchRelatedWorkflows = async () => {
      const res = await fetch(
        `/api/listPackageRelatedWorkflows?gitRepo=${gitRepo}`,
      );
      const data = await res.json();
      if (data?.hits?.length) {
        setWorkflows(data.hits.map((hit: any) => hit._source));
      }
    };
    fetchRelatedWorkflows();
  }, []);
  return (
    <Box>
      <Heading as="h2" size="md" mb={4}>
        Related Workflows
      </Heading>
      <Flex gap={2} wrap={"wrap"}>
        {workflows.map((wf) => (
          <WorkflowCard wf={wf} key={wf.id} />
        ))}
      </Flex>
    </Box>
  );
}
