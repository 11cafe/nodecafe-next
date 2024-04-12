import { SessionUser } from "next-auth";

export const NODE_ID_SPLITTER = "~";
export const NODE_LIB_ORIGIN = "https://dvj4wd4dhhe9a.cloudfront.net";
export const WORKFLOW_WORKSPACE_INFO_FIELD = "workspace_info";
export const powerUserSession: SessionUser = {
  id: "powerUser",
  provider: "powerUser",
  isAdmin: true,
  isPowerUser: true,
};
