import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import NodeDetails from "./NodeDetails";
import { ComfyNode } from "@/server/dbTypes";

type Props = {
  onClose: () => void;
  node: ComfyNode;
};
export default function NodeDetailsModal({ onClose, node }: Props) {
  return (
    <Modal isOpen={true} onClose={onClose} blockScrollOnMount={true}>
      <ModalOverlay />
      <ModalContent width={"90%"} maxWidth={"90vw"} height={"90vh"}>
        <NodeDetails node={node} />
      </ModalContent>
    </Modal>
  );
}
