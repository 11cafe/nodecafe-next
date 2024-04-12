import type { IDBAdapter } from "../db-adapters/IDBAdapter";
import { NodePackageTable } from "./NodePackageTable";
import { NodeTable } from "./NodeTable";
import { TableBase } from "./TableBase";
import { DynamoAdapter } from "../db-adapters/DynamoAdapter";
import { PostgresAdapter } from "../db-adapters/PostgresAdapter";
import type {
  ComfyPackageComment,
  ComfyUser,
  DBModel,
  TempData,
} from "../dbTypes";
import { WorkflowTable } from "./WorkflowTable";
import { WorkflowVersionTable } from "./WorkflowVersionTable";
import { UserTable } from "./UserTable";
import { ModelTable } from "../node_manager/ModelTable";

const dbType: "dynamodb" | "postgres" = "dynamodb";
let adapter: IDBAdapter<DBModel>;
if (dbType === "dynamodb") {
  adapter = new DynamoAdapter<DBModel>();
} else {
  adapter = new PostgresAdapter<DBModel>();
}

export class DBTables {
  public node: NodeTable | null = new NodeTable(
    "ComfyNode",
    {
      indexes: ["packageID"],
    },
    adapter,
  );
  public nodePackage: NodePackageTable | null =
    this.node &&
    new NodePackageTable(
      "ComfyNodePackage",
      {
        indexes: ["gitRepo"],
      },
      adapter,
      this.node,
    );
  public packageComment: TableBase<ComfyPackageComment> | null =
    new TableBase<ComfyPackageComment>(
      "ComfyPackageComment",
      {
        indexes: ["authorID", "packageID"],
      },
      adapter,
    );
  public user: TableBase<ComfyUser> | null = new UserTable(adapter);
  public tempData: TableBase<TempData> | null = new TableBase<TempData>(
    "TempData",
    {},
    adapter,
  );
  public cloudflow: WorkflowTable | null = new WorkflowTable(adapter);
  public cloudflowVersion: WorkflowVersionTable | null =
    this.cloudflow && new WorkflowVersionTable(adapter, this.cloudflow);
  public model: ModelTable | null = new ModelTable(
    "ComfyModelFile",
    {
      indexes: ["folderName"],
    },
    adapter,
  );
}

export const dbTables = new DBTables();
