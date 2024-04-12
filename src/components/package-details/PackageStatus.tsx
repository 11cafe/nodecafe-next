import { ENodePackageStatus, NodePackage } from "@/server/dbTypes";
import { Text, HStack, Heading, IconButton, Stack } from "@chakra-ui/react";
import HoverMenu from "../HoverMenu";
import { IconInfoCircle } from "@tabler/icons-react";

export default function PackageStatus({ pkg }: { pkg: NodePackage }) {
  const statusText = getStatusLabel(pkg.status);

  return (
    <HStack>
      <Heading size={"sm"}>{statusText}</Heading>
      <HoverMenu
        delayVanish={1}
        menuButton={
          <IconButton
            size={"xs"}
            aria-label="Status Info"
            icon={<IconInfoCircle size={17} />}
          />
        }
        menuContent={
          <Stack px={2} width={260}>
            {pkg.updatedAt && (
              <p>
                Last installed{": "}
                {new Date(pkg.updatedAt).toLocaleDateString()}
              </p>
            )}
            <p>
              We record package metrics by automatically installing custom nodes
              on our ComfyUI server (Linux, Python 3.10)
            </p>
            <p>
              If &quot;Auto install failed&quot;, it means you need some manual
              setup steps to make it work.
            </p>
          </Stack>
        }
      />
    </HStack>
  );
}

function getStatusLabel(status: ENodePackageStatus) {
  switch (status) {
    case ENodePackageStatus.PENDING:
      return "🕛 Pending";
    case ENodePackageStatus.IMPORT_FAILED:
      return "❌ Auto Install Failed";
    case ENodePackageStatus.IMPORT_SUCCESS:
      return "✅ Install successful";
    case ENodePackageStatus.TEST_WORKFLOW_FAILED:
      return "Test Failed";
    case ENodePackageStatus.TEST_WORKFLOW_SUCCESS:
      return "✅ Test successful";
  }
}
