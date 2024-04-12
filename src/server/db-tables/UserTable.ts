import { TableBase } from "./TableBase";
import { type DBModel, type ComfyUser } from "../dbTypes";
import type { IDBAdapter } from "../db-adapters/IDBAdapter";
import { SessionUser } from "next-auth";

export class UserTable extends TableBase<ComfyUser> {
  constructor(adapter: IDBAdapter<DBModel>) {
    super(
      "ComfyUser",
      {
        indexes: ["email", "oauthSub", "provider"],
        privateFields: ["email", "oauthSub", "provider"],
      },

      adapter,
    );
  }
  protected async hasWriteAccessToItem(
    scope: "delete" | "update" | "create",
    item: ComfyUser,
    userSession: SessionUser | null,
  ): Promise<boolean> {
    if (scope === "create") return true;
    if (userSession && userSession.id === item.id) return true;
    return false;
  }
}
