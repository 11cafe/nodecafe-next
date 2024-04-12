import {
  Box,
  Button,
  Text,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  Alert,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import LoginModal from "../auth/LoginModal";
import { useState } from "react";
import { IconPlus } from "@tabler/icons-react";

export default function RequestNodeDialog() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const onSubmit = () => {
    setLoading(true);
    fetch("/api/node/scanGitUrl?url=" + url)
      .then((resp) => resp.json())
      .then((res) => {
        setLoading(false);
        if (res.error) {
          setError(res.error);
          return;
        } else if (res.data && res.data.id) {
          window.location.href = "/node/" + res.data.id;
        }
      })
      .catch((e) => {
        setLoading(false);
      });
  };
  return (
    <>
      <Button
        variant={"outline"}
        size={"sm"}
        leftIcon={<IconPlus size={"18px"} />}
        iconSpacing={"2px"}
        onClick={() => setIsOpen(true)}
      >
        Request Node
      </Button>

      {isOpen &&
        (!session ? (
          <LoginModal onClose={() => setIsOpen(false)} />
        ) : (
          <Modal isOpen={true} onClose={() => setIsOpen(false)}>
            <ModalContent>
              <ModalBody>
                <Box p={2} pb={4}>
                  <Text mb={5}>
                    Looking for a ComfyUI custom node not listed? Share the
                    GitHub URL and we{"'"}ll add it to the library!
                  </Text>
                  <Input
                    placeholder="https://github.com/melMass/comfy_mtb"
                    onChange={(e) => setUrl(e.target.value)}
                    value={url}
                  />
                  {error && <Alert status="error">{error}</Alert>}

                  <Button
                    mt={4}
                    colorScheme={"blue"}
                    size={"sm"}
                    onClick={onSubmit}
                    isLoading={loading}
                  >
                    Submit
                  </Button>
                </Box>
              </ModalBody>
            </ModalContent>
          </Modal>
        ))}
    </>
  );
}
