import { NodePackage } from "@/server/dbTypes";
import { Text, HStack, Heading, Button } from "@chakra-ui/react";
import { IconTriangleInvertedFilled } from "@tabler/icons-react";

export default function PackageVersionSelector({ pkg }: { pkg: NodePackage }) {
  return (
    <HStack>
      <Heading size={"sm"}>Version</Heading>
      <Button
        size={"sm"}
        variant={"outline"}
        rightIcon={<IconTriangleInvertedFilled size={10} />}
      >
        <Text
          maxWidth="200px"
          flexShrink={1}
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
        >
          {pkg.latestCommit?.slice(0, 7) ?? "No version"}
        </Text>
      </Button>
      {pkg.updatedAt && (
        <Text fontSize={"sm"} color={"gray"}>
          Recorded at {new Date(pkg.updatedAt).toLocaleDateString()}
        </Text>
      )}
    </HStack>
  );
}
