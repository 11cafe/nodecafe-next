import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import LoginForm from "./LoginForm";

function LoginModal({ onClose }: { onClose: () => void }) {
  return (
    <>
      <Modal isOpen={true} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Login</ModalHeader>
          {/* <ModalCloseButton /> */}
          <ModalBody>
            <LoginForm />
          </ModalBody>
          <ModalFooter>
            {/* <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default LoginModal;
