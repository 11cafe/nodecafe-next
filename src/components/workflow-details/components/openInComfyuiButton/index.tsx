import {
  Box,
  Button,
  MenuDivider,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  useDisclosure,
  HStack,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { Workflow, WorkflowVersion } from "@/server/dbTypes";
import HoverMenu from "../../../HoverMenu";
import {
  IconPlus,
  IconTriangleInvertedFilled,
  IconTrash,
} from "@tabler/icons-react";
import { ChangeEvent, useState, useEffect } from "react";
import { COMFYUI_DOMAIN_STORAGE_KEY } from "../../constant";
import useIsFirstRender from "../../../hooks/useIsFirstRender";

type Props = {
  version: WorkflowVersion | null;
  workflow: Workflow;
};

export default function OpenInComfyuiButton({ workflow, version }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [newDomainName, setNewDomainName] = useState("");

  const [inputError, setInputError] = useState("");

  const isFirstRender = useIsFirstRender();

  const [domainList, setDomainList] = useState<string[]>(() => {
    let localDomainList = [];
    try {
      localDomainList = JSON.parse(
        window.localStorage.getItem(COMFYUI_DOMAIN_STORAGE_KEY) ??
          `["http://127.0.0.1:8188/"]`,
      );
    } catch (err) {}
    return localDomainList;
  });
  useEffect(() => {
    if (!isFirstRender) {
      window.localStorage.setItem(
        COMFYUI_DOMAIN_STORAGE_KEY,
        JSON.stringify(domainList),
      );
    }
  }, [domainList]);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewDomainName(event.target.value);
    inputError && setInputError("");
  };

  const onCloseModal = () => {
    setNewDomainName("");
    setInputError("");
    onClose();
  };

  const addDomainName = () => {
    if (
      !newDomainName.match(
        /^(https?:\/\/)?(([\da-z\.-]+)\.([a-z\.]{2,6})|localhost|(\d{1,3}\.){3}\d{1,3})(:\d+)?(\/[\/\w \.-]*)*\/?$/,
      )
    ) {
      setInputError("The domain you entered does not have a valid URL");
      return;
    }
    setDomainList([...new Set([...domainList, newDomainName])]);
    onCloseModal();
  };

  const onDelete = (d: string) => {
    setDomainList(domainList.filter((domain) => domain !== d));
  };

  const onClickDomain = (domain: string = "http://127.0.0.1:8188") => {
    const sharePopup = window.open(domain, "_blank");
    const sendToComfyuiWorkspace = (event: MessageEvent) => {
      const url = new URL(domain);
      // sanitize user input domain to origin
      const origin = url.origin;
      if (event.origin !== origin) {
        return;
      }
      if (event.data === "comfyui_workspace_manager_connected") {
        sharePopup!.postMessage(
          {
            type: "workspace_open_workflow",
            detail: {
              workflow: workflow,
              version: version,
            },
          },
          domain,
        );
        removeEventListener("message", sendToComfyuiWorkspace);
      }
    };
    addEventListener("message", sendToComfyuiWorkspace);
    setTimeout(() => {
      removeEventListener("message", sendToComfyuiWorkspace);
    }, 5000);
  };

  if (version == null) {
    return null;
  }

  return (
    <>
      <HoverMenu
        menuButton={
          <Button
            colorScheme="teal"
            size={"sm"}
            rightIcon={<IconTriangleInvertedFilled size={10} />}
          >
            Open in ComfyUI
          </Button>
        }
        menuContent={
          <Box maxW={430}>
            {domainList.map((domain: string) => (
              <MenuItem key={domain} onClick={() => onClickDomain(domain)}>
                <HStack spacing="8px" maxW={410}>
                  <Text noOfLines={1}>{domain}</Text>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(domain);
                    }}
                    aria-label="delete-domain"
                    colorScheme="red"
                    variant={"ghost"}
                    icon={<IconTrash />}
                  />
                </HStack>
              </MenuItem>
            ))}

            <MenuDivider />
            <MenuItem iconSpacing={1} icon={<IconPlus />} onClick={onOpen}>
              Add ComfyUI domain
            </MenuItem>
          </Box>
        }
      />
      <Modal isOpen={isOpen} onClose={onCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add ComfyUI domain</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={!!inputError}>
              <FormLabel>Domain name</FormLabel>
              <Input
                value={newDomainName}
                onChange={handleChange}
                type="url"
                autoFocus
                onKeyUp={(e) => {
                  e.code === "Enter" &&
                    !inputError &&
                    newDomainName &&
                    addDomainName();
                }}
              />
              {inputError && <FormErrorMessage>{inputError}</FormErrorMessage>}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="teal"
              mr={3}
              onClick={addDomainName}
              isDisabled={!newDomainName || !!inputError}
            >
              Save
            </Button>
            <Button onClick={onCloseModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
