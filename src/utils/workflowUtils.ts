import { DepsResult } from "@/consts/types";
import { WORKFLOW_WORKSPACE_INFO_FIELD } from "./consts";

export function getDepsFromWorkflowJson(json: string): DepsResult | null {
  const workflowJson = JSON.parse(json);
  return workflowJson.extra?.[WORKFLOW_WORKSPACE_INFO_FIELD]
    ?.deps as DepsResult | null;
}
