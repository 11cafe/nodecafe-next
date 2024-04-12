import {
  Button,
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
  HStack,
  VStack,
  RadioGroup,
  Radio,
  useToast,
} from "@chakra-ui/react";
import { EWorkflowPrivacy, Workflow } from "@/server/dbTypes";
import { ChangeEvent, useState } from "react";
import { updateCloudFlowResponse } from "@/pages/api/workflow/updateCloudFlow";
import { getWorkflowPrivacyLabel } from "@/utils/privacyUtils";

type Props = {
  workflow: Workflow;
  onClose: () => void;
};

interface EditData {
  name: string;
  privacy: EWorkflowPrivacy;
}

export default function SettingsModal({
  workflow: { id, name, privacy },
  onClose,
}: Props) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [editData, setEditData] = useState<EditData>({
    name,
    privacy,
  });

  const [inputError, setInputError] = useState("");

  const onChange = (type: keyof EditData, val: string) => {
    setEditData({
      ...editData,
      [type]: val,
    });
    inputError && setInputError("");
  };

  const onSubmit = async () => {
    setLoading(true);
    const res = await fetch("/api/workflow/updateCloudFlow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        updateData: editData,
      }),
    });

    const resJson = (await res.json()) as updateCloudFlowResponse;

    if (resJson.code === "200") {
      toast({
        title: "Saved successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      setLoading(false);
      onClose();
      window.location.reload();
    } else if (resJson.code === "InvalidFlowName.Duplicated") {
      setInputError(
        "The name is duplicated, please modify it and submit again.",
      );
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Settings</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch" w="100%">
            <FormControl isInvalid={!!inputError} isRequired>
              <FormLabel fontWeight={700}>Workflow Name</FormLabel>
              <Input
                value={editData.name}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  onChange("name", event.target.value);
                }}
              />
              {inputError && <FormErrorMessage>{inputError}</FormErrorMessage>}
            </FormControl>
            <FormControl>
              <FormLabel fontWeight={700}>Privacy</FormLabel>
              <RadioGroup
                value={editData.privacy}
                onChange={(val) => {
                  onChange("privacy", val);
                }}
              >
                <HStack spacing="24px">
                  {Object.values(EWorkflowPrivacy).map((item) => (
                    <Radio key={item} value={item}>
                      {getWorkflowPrivacyLabel(item)}
                    </Radio>
                  ))}
                </HStack>
              </RadioGroup>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="teal"
            mr={3}
            onClick={onSubmit}
            isDisabled={!editData.name || !!inputError}
            isLoading={loading}
          >
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
