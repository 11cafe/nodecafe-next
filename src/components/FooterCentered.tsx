import { Flex, IconButton } from "@chakra-ui/react";
import { IconBrandDiscord, IconBrandGithub } from "@tabler/icons-react";

const links = [
  { link: "#", label: "Contact" },
  { link: "#", label: "Privacy" },
];

export function FooterCentered() {
  return (
    <Flex pt={30} pb={8} gap={6} justifySelf={"flex-end"}>
      <a
        href="https://github.com/11cafe/comfyui-workspace-manager"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
      >
        <IconButton
          size={"xs"}
          icon={<IconBrandGithub />}
          aria-label="github"
          variant={"ghost"}
        />
      </a>
      <a
        href="https://discord.gg/HHvfEurv2Z"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
      >
        <IconButton
          size={"xs"}
          icon={<IconBrandDiscord />}
          variant={"ghost"}
          aria-label="discord"
        />
      </a>
    </Flex>
  );
}
