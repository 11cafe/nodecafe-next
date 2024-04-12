import {
  Button,
  Text,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { useState, useRef, PropsWithChildren } from "react";

type Props = {
  promptMessage: string;
  isDisabled?: boolean;
  variant?: string;
  onDelete: () => Promise<boolean>;
};

export default function DeleteConfirmAlert(props: PropsWithChildren<Props>) {
  const {
    promptMessage = "Are you sure you want to delete this?",
    variant = "ghost",
    onDelete,
    isDisabled = false,
    children,
  } = props;
  const cancelRef = useRef(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [loading, setLoading] = useState(false);

  const onDeleteHandler = async () => {
    setLoading(true);
    await onDelete();
    setLoading(false);
    onClose();
  };

  return (
    <>
      {children ? (
        <Text onClick={onOpen}>{children}</Text>
      ) : (
        <Button
          colorScheme="red"
          onClick={onOpen}
          variant={variant}
          isDisabled={isDisabled}
        >
          Delete
        </Button>
      )}

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Confirmation
            </AlertDialogHeader>

            <AlertDialogBody>{promptMessage}</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={onDeleteHandler}
                ml={3}
                isLoading={loading}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
