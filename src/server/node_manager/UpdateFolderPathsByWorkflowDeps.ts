import { DepsResult } from "@/consts/types";
import {
  WORKFLOW_WORKSPACE_INFO_FIELD,
  powerUserSession,
} from "@/utils/consts";
import { dbTables } from "../db-tables/dbTables";
import { ModelFileDB, NodeFolderPath } from "../dbTypes";
import { SessionUser } from "next-auth";

export async function updateFolderPathsByWorkflowDeps(
  sessionUser: SessionUser,
  workflowJson: any,
) {
  const deps = workflowJson.extra?.[WORKFLOW_WORKSPACE_INFO_FIELD].deps as
    | DepsResult
    | undefined;
  if (!deps) {
    return;
  }
  deps.models = deps.models || {};
  const nodeRepos = deps.nodeRepos.map((nodeRepo) => {
    return nodeRepo.gitRepo;
  });
  const processModelsPromises = Object.values(deps.models).map(
    async (model) => {
      if (!model.nodeType || !model.inputName || !model.fileFolder) {
        return;
      }
      const comfyNode = await dbTables.node
        ?.listByIndex(null, "nodeType", model.nodeType)
        .then((nodes) => {
          if (nodes.length == 1) {
            return nodes[0];
          }
          return nodes.find((node) => {
            return nodeRepos.includes(node.gitRepo);
          });
        });
      if (!comfyNode) {
        return;
      }
      const folderPaths = JSON.parse(comfyNode.folderPaths || "{}") as Record<
        string,
        NodeFolderPath
      >;
      folderPaths[model.inputName] = {
        folder_name: model.fileFolder,
      };
      await dbTables.node?.update(
        comfyNode.id,
        {
          folderPaths: JSON.stringify(folderPaths),
        },
        powerUserSession,
      );
    },
  );
  await Promise.all(processModelsPromises);
}

export async function addModelRecord(workflowJson: any) {
  const deps = workflowJson.extra?.[WORKFLOW_WORKSPACE_INFO_FIELD].deps as
    | DepsResult
    | undefined;
  if (!deps) {
    return;
  }

  const promises = Object.values(deps.models || {}).map(async (model) => {
    if (!model.fileHash || !model.fileFolder || !model.downloadUrl) return;
    model.downloadUrl = model.downloadUrl.trim();
    if (model.downloadUrl.endsWith("/")) {
      model.downloadUrl = model.downloadUrl.slice(0, -1);
    }
    const existingModel = await dbTables.model?.get(model.fileHash);

    const { modelId, versionId } = extractCivitaiIdsFromInfoUrl(
      model.infoUrl ?? "",
    );
    if (!existingModel) {
      await dbTables.model?.create(
        {
          id: model.fileHash,
          downloadUrls: [model.downloadUrl],
          folderName: model.fileFolder,
          downloadUrl: model.downloadUrl,
          civitID: modelId,
          civitVersionID: versionId,
          filename: model.filename,
          filehash: model.fileHash,
        },
        powerUserSession,
      );
    } else {
      const downloadUrls: string[] = existingModel.downloadUrls ?? [];
      if (!downloadUrls.includes(model.downloadUrl)) {
        downloadUrls.push(model.downloadUrl);
        const input: Partial<ModelFileDB> = {
          downloadUrls: downloadUrls,
        };
        if (modelId) {
          input.civitID = modelId;
        }
        if (versionId) {
          input.civitVersionID = versionId;
        }
        await dbTables.model?.update(existingModel.id, input, powerUserSession);
      }
    }
  });
  await Promise.all(promises);
}

// given https://civitai.com/models/60132?modelVersionId=198960 return ids
function extractCivitaiIdsFromInfoUrl(url: string): {
  modelId: string | null;
  versionId: string | null;
} {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname !== "civitai.com") {
      return { modelId: null, versionId: null };
    }

    const pathParts = urlObj.pathname.split("/").filter((part) => part !== "");

    let modelId = null;
    let versionId = null;

    if (pathParts.length >= 2 && pathParts[0] === "models") {
      modelId = pathParts[1];
    }

    const searchParams = new URLSearchParams(urlObj.search);
    versionId = searchParams.get("modelVersionId") || null;

    return { modelId, versionId };
  } catch (e) {
    return { modelId: null, versionId: null };
  }
}
