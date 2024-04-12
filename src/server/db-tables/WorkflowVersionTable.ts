import { TableBase } from "./TableBase";
import type { DBModel, Workflow, WorkflowVersion } from "../dbTypes";
import type { IDBAdapter } from "../db-adapters/IDBAdapter";
import { Session, SessionUser } from "next-auth";

export class WorkflowVersionTable extends TableBase<WorkflowVersion> {
  private workflowTable: TableBase<Workflow>;
  constructor(
    adapter: IDBAdapter<DBModel>,
    workflowTable: TableBase<Workflow>,
  ) {
    super(
      "CloudflowVersion",
      {
        indexes: ["authorID", "workflowID"],
      },
      adapter,
    );
    this.workflowTable = workflowTable;
  }

  async hasReadAccessToItem(
    item: WorkflowVersion,
    userSession: SessionUser | null,
  ) {
    try {
      const workflow = await this.workflowTable.get(
        item.workflowID,
        userSession,
      );
      return workflow != null;
    } catch (error) {
      return false;
    }
  }

  async hasWriteAccessToItem(
    scope: "delete" | "update" | "create",
    item: WorkflowVersion,
    userSession: SessionUser | null,
  ) {
    const hasWriteAccess = await this.workflowTable.hasWriteAccessToID(
      userSession,
      "update",
      item.workflowID,
    );
    return hasWriteAccess;
  }

  async listAll(limit?: number, nextToken?: string) {
    throw new Error("Method not allowed.");
    return { items: [], nextToken: null };
  }

  public async listByIndex<K extends keyof WorkflowVersion>(
    userSession: Session["user"] | null,
    indexPk: K,
    eq: string,
    sortOrder?: "ASC" | "DESC",
    limit?: number,
  ): Promise<WorkflowVersion[]> {
    if (indexPk === "workflowID") {
      // delegate access control check to workflow table
      if ((await this.workflowTable.get(eq, userSession)) != null) {
        try {
          const result = await this.adapter.listByIndex(
            this.tableName,
            indexPk,
            eq,
            limit,
            sortOrder,
          );
          return result.items as WorkflowVersion[];
        } catch (error) {
          console.error("Error in listByIndex operation:", error);
          return [];
        }
      } else {
        // no access to workflow
        return [];
      }
    }
    throw new Error("Invalid index for Workflow Version Table");
  }
}
