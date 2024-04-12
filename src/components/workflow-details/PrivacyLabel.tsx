import { EWorkflowPrivacy } from "@/server/dbTypes";
import { Tag } from "@chakra-ui/react";
import { getPrivacyIcon, getWorkflowPrivacyLabel } from "@/utils/privacyUtils";

export default function PrivacyLabel({
  privacy,
}: {
  privacy: EWorkflowPrivacy;
}) {
  return (
    <Tag variant="outline" borderRadius="full">
      {getPrivacyIcon(privacy)}
      <p>{getWorkflowPrivacyLabel(privacy)}</p>
    </Tag>
  );
}
