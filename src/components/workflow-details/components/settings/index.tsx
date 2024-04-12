import { Button } from "@chakra-ui/react";
import { Workflow } from "@/server/dbTypes";
import { useState } from "react";
import SettingsModal from "./SettingsModal";
import { IconSettings } from "@tabler/icons-react";

type Props = {
  workflow: Workflow;
};

export default function Settings({ workflow }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button
        size={"sm"}
        leftIcon={<IconSettings size={18} />}
        onClick={() => {
          setVisible(true);
        }}
      >
        Settings
      </Button>
      {visible ? (
        <SettingsModal
          workflow={workflow}
          onClose={() => {
            setVisible(false);
          }}
        />
      ) : null}
    </>
  );
}
