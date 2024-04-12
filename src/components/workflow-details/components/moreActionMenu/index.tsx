import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { IconDotsVertical, IconMenu2 } from "@tabler/icons-react";
import DeleteConfirmAlert from "@/components/DeleteConfirmAlert";
import { deleteCloudFlowResponse } from "@/pages/api/workflow/deleteCloudFlow";

export default function MoreActionMenu({ workflowId }: { workflowId: string }) {
  const toast = useToast();
  const router = useRouter();

  const onDeleteFlow = async () => {
    const res = await fetch("/api/workflow/deleteCloudFlow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: workflowId,
      }),
    });

    const resJson = (await res.json()) as deleteCloudFlowResponse;

    if (resJson.code === "200") {
      toast({
        title: "Deleted successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      router.push("/my_workflows");
      return true;
    }
    return false;
  };

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<IconDotsVertical size={20} />}
        size={"sm"}
        variant="outline"
      />
      <MenuList zIndex={101}>
        <DeleteConfirmAlert
          promptMessage="Are you sure you want to delete this workflow?"
          onDelete={onDeleteFlow}
        >
          <MenuItem>Delete</MenuItem>
        </DeleteConfirmAlert>
      </MenuList>
    </Menu>
  );
}
