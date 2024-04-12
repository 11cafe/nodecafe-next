import { EWorkflowPrivacy } from "@/server/dbTypes";

export function getPrivacyIcon(privacy: EWorkflowPrivacy) {
  switch (privacy) {
    case EWorkflowPrivacy.PUBLIC:
      return "🌐";
    case EWorkflowPrivacy.PRIVATE:
      return "🔒";
    case EWorkflowPrivacy.UNLISTED:
      return "🔗";
  }
}

export const getWorkflowPrivacyLabel = (privacy: EWorkflowPrivacy) => {
  switch (privacy) {
    case EWorkflowPrivacy.PUBLIC:
      return "Public";
    case EWorkflowPrivacy.PRIVATE:
      return "Private";
    case EWorkflowPrivacy.UNLISTED:
      return "Unlisted";
  }
};
