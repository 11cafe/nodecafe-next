import { NodePackage } from "@/server/dbTypes";
import { Alert, AlertIcon, HStack, Text } from "@chakra-ui/react";
import { useState } from "react";

export default function ErrorAlert({ pkg }: { pkg: NodePackage }) {
  const [showAll, setShowAll] = useState(false);
  if (!pkg.importError) {
    return null;
  }
  return (
    <Alert status="error">
      <HStack>
        <AlertIcon />
        <Text
          noOfLines={showAll ? undefined : 3}
          cursor={"pointer"}
          onClick={() => setShowAll(!showAll)}
          style={{ whiteSpace: "pre-wrap" }} // Add this line to preserve whitespace
        >
          {pkg.importError}
        </Text>
      </HStack>
    </Alert>
  );
}
