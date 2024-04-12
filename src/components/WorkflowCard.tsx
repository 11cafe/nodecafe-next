import type { Workflow } from "@/server/dbTypes";
import { Card, CardBody, HStack, Heading, Tag } from "@chakra-ui/react";
import PrivacyLabel from "./workflow-details/PrivacyLabel";
import { getPrivacyIcon } from "@/utils/privacyUtils";

export default function WorkflowCard({ wf }: { wf: Workflow }) {
  return (
    <Card variant={"outline"} width={"sm"}>
      <a
        href={`/workflow/${wf.id}`}
        style={{ textDecoration: "none" }}
        target="_blank"
      >
        <CardBody>
          <Heading size="sm" mb={2} noOfLines={2}>
            {wf.name}
          </Heading>

          {wf.deps?.length && (
            <Tag mb={2} colorScheme="teal">
              Workspace included
            </Tag>
          )}

          <HStack>
            <Tag borderRadius="full">{getPrivacyIcon(wf.privacy)}</Tag>
            {wf.createdAt && (
              <p style={{ color: "GrayText" }}>
                {new Date(wf.createdAt).toLocaleDateString()}
              </p>
            )}
          </HStack>
        </CardBody>
      </a>
    </Card>
  );
}
