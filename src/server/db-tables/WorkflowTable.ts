import { TableBase } from "./TableBase";
import { EWorkflowPrivacy, type DBModel, type Workflow } from "../dbTypes";
import type { IDBAdapter } from "../db-adapters/IDBAdapter";
import { Session, SessionUser } from "next-auth";

export class WorkflowTable extends TableBase<Workflow> {
  constructor(adapter: IDBAdapter<DBModel>) {
    super(
      "Cloudflow",
      {
        indexes: ["authorID"],
      },
      adapter,
    );
  }
  async hasReadAccessToItem(item: Workflow, userSession: SessionUser | null) {
    if (item.privacy === EWorkflowPrivacy.PUBLIC) return true;
    if (item.privacy === EWorkflowPrivacy.UNLISTED) return true;
    if (userSession && userSession.id === item.authorID) return true;
    return false;
  }

  async hasWriteAccessToItem(
    scope: "delete" | "update" | "create",
    item: Workflow,
    userSession: SessionUser | null,
  ) {
    if (scope === "create") return true;
    if (userSession && userSession.id === item.authorID) return true;
    return false;
  }

  async listAll(limit?: number, nextToken?: string) {
    throw new Error("Method not allowed.");
    return { items: [], nextToken: null };
  }
  async listByIndex<K extends keyof Workflow>(
    session: Session["user"] | null,
    indexPk: K,
    eq: string,
    sortOrder?: "ASC" | "DESC",
    limit?: number,
  ): Promise<Workflow[]> {
    if (indexPk === "authorID") {
      return super.listByIndex(session, indexPk, eq, sortOrder, limit);
    }
    throw new Error("Invalid index for Workflow Table");
  }
}
