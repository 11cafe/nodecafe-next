import { HStack, Heading, IconButton, Stack, Text } from "@chakra-ui/react";
import HoverMenu from "../HoverMenu";
import { NodePackage } from "@/server/dbTypes";
import { IconInfoCircle } from "@tabler/icons-react";

export function PackageImportTime({ pkg }: { pkg: NodePackage }) {
  const importTime = pkg.importTime
    ? new Number(pkg.importTime).toFixed(2)
    : null;
  const installTime = pkg.installTime
    ? new Number(pkg.installTime).toFixed(2)
    : null;
  return (
    <>
      {importTime && (
        <HStack>
          <Text size={"sm"}>Import time</Text>
          <Heading size={"sm"}>{importTime}s</Heading>

          <HoverMenu
            menuButton={
              <IconButton
                size={"xs"}
                aria-label="Status Info"
                icon={<IconInfoCircle size={17} />}
              />
            }
            delayVanish={1}
            menuContent={
              <Stack px={2} width={260}>
                <p>
                  Time spent to import this node package when starting up
                  ComfyUI server each time
                </p>
              </Stack>
            }
          />
        </HStack>
      )}
      {installTime && (
        <HStack>
          <Text size={"sm"}>Install time</Text>
          <Heading size={"sm"}>{installTime}s</Heading>

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
                <p>Time spent to git clone and install this node package</p>
              </Stack>
            }
          />
        </HStack>
      )}
    </>
  );
}
