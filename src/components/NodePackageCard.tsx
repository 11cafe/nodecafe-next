import { ENodePackageStatus, NodePackage } from "@/server/dbTypes";
import {
  Badge,
  Box,
  HStack,
  Heading,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";

export default function NodePackageCard({
  pkg,
  rank,
}: {
  pkg: NodePackage;
  rank?: number;
}) {
  return (
    <Stack
      key={pkg.id}
      mb={4}
      borderWidth="1px"
      p={3}
      cursor={"pointer"}
      onClick={() => {
        window.location.href = `/package/${pkg.id}`;
      }}
    >
      <HStack justifyContent={"space-between"} wrap={"wrap"}>
        <HStack>
          {rank != null && (
            <Tag size={"sm"} width={"fit-content"}>
              {rank + 1}
            </Tag>
          )}

          <Link href={`/package/${pkg.id}`}>
            <Heading size={"sm"}>{pkg.nameID}</Heading>
          </Link>
        </HStack>
        <HStack gap={3}>
          <Text color={"GrayText"} fontWeight={"500"}>
            {pkg.totalNodes} nodes
          </Text>
          {pkg.ownerGitAvatarUrl && (
            <Image
              src={pkg.ownerGitAvatarUrl}
              alt="owner-git-avatar"
              width={20}
              height={20}
            />
          )}
          <Text color={"GrayText"}>{pkg.gitRepo.split("/")[0]} </Text>
          {/* <IconStar size={20} color="#DBB556" /> */}
          <Text>⭐️{pkg.totalStars} </Text>
        </HStack>
      </HStack>
      {pkg.status === ENodePackageStatus.IMPORT_FAILED && (
        <Tag colorScheme="red" width={"fit-content"}>
          Auto-install failed
        </Tag>
      )}
      <Text wordBreak={"break-all"} noOfLines={2}>
        {pkg.description}
      </Text>
      {/* <HStack overflow={"hidden"}>
    {pkg.nodes.slice(0, 4).map((node) => (
      <Tag key={node}>
        <Text
          maxWidth={200}
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          textAlign="left"
        >
          {node}
        </Text>
      </Tag>
    ))}
  </HStack> */}
    </Stack>
  );
}
