import { TableBase } from "./TableBase";
import { ComfyNode, DBModel } from "../dbTypes";
import { SessionUser } from "next-auth";

export class NodeTable extends TableBase<ComfyNode> {
  protected async hasWriteAccessToItem(
    scope: "delete" | "update" | "create",
    item: ComfyNode,
    userSession: SessionUser | null,
  ): Promise<boolean> {
    if (userSession?.isPowerUser || userSession?.isAdmin) return true;
    const isGitRepoOwner =
      userSession?.provider == "github" &&
      userSession?.login == item.gitRepo.split("/")[0];
    return isGitRepoOwner;
  }
}
