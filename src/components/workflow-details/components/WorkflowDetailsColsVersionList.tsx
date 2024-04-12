import type { Workflow, WorkflowVersion } from "@/server/dbTypes";
import {
  Heading,
  Stack,
  Button,
  HStack,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { IconTrash } from "@tabler/icons-react";
import { useSession } from "next-auth/react";

export default function WorkflowDetailsColsVersionList({
  versions,
  workflow,
  version,
}: {
  versions: WorkflowVersion[];
  workflow: Workflow;
  version: WorkflowVersion | null;
}) {
  const { data: session } = useSession();
  const isAuthor = workflow.authorID === session?.user.id;
  const toast = useToast();
  return (
    <Stack>
      <Heading size={"sm"}>Versions</Heading>
      {versions?.map((ver) => (
        <HStack key={ver.id}>
          <a
            href={"/workflow/" + workflow.id + "/" + ver.id}
            key={ver.id}
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <Button
              isActive={ver.id === version?.id}
              _active={{
                bg: "teal.500",
                color: "white",
              }}
              size={"sm"}
              width={"250px"}
              position={"relative"}
            >
              {ver.name}
            </Button>
          </a>
          {isAuthor && (
            <IconButton
              aria-label="delete version"
              size={"sm"}
              variant={"ghost"}
              colorScheme="red"
              icon={<IconTrash />}
              onClick={async () => {
                const input = confirm(
                  `Are you sure you want to delete version "${ver.name}"?`,
                );
                if (input) {
                  const resp = await fetch(
                    "/api/workflow/deleteWorkflowVersion",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        id: ver.id,
                      }),
                    },
                  ).then((res) => res.json());
                  if (resp.error) {
                    alert(resp.error);
                  } else {
                    location.reload();
                    toast({
                      title: "Version deleted",
                      status: "success",
                      duration: 2000,
                      isClosable: true,
                    });
                  }
                }
              }}
            />
          )}
        </HStack>
      ))}
    </Stack>
  );
}
