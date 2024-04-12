import { useRef, useState } from "react";
import CustomMenu from "./CustomMenu";
import { Box, Menu, MenuList } from "@chakra-ui/react";
type Props = {
  menuButton: React.ReactElement;
  menuContent: React.ReactElement;
  onClose?: () => void;
  delayVanish?: number;
};
export default function HoverMenu({
  menuButton,
  menuContent,
  onClose,
  delayVanish,
}: Props) {
  const closeTimeoutId = useRef<number>();
  const [isOpen, setIsOpen] = useState(false);
  const delayedClose = () => {
    closeTimeoutId.current = setTimeout(
      () => setIsOpen(false),
      delayVanish ?? 350,
    ) as unknown as number; // delay of 350ms
  };

  const onOpen = () => {
    setIsOpen(true);
    clearTimeout(closeTimeoutId.current);
    closeTimeoutId.current = undefined;
  };
  return (
    <CustomMenu
      isOpen={isOpen}
      onClose={delayedClose}
      menuButton={
        <Box
          aria-label="menu"
          onClick={onOpen}
          onMouseEnter={onOpen}
          onMouseLeave={delayedClose}
        >
          {menuButton}
        </Box>
      }
      options={
        <Menu isOpen={true} isLazy>
          <MenuList
            minWidth={150}
            zIndex={1000}
            onMouseEnter={onOpen}
            onMouseLeave={delayedClose}
          >
            {menuContent}
          </MenuList>
        </Menu>
      }
    />
  );
}
