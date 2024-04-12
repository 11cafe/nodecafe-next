import { TableBase } from "./TableBase";
import type { DBModel, ModelMetadata, NodePackage } from "../dbTypes";
import type { IDBAdapter } from "../db-adapters/IDBAdapter";
import type { NodeTable } from "./NodeTable";
import queryOpensearch from "../search/opensearchQuery";
import { SessionUser } from "next-auth";

export class NodePackageTable extends TableBase<NodePackage> {
  private nodeTable: NodeTable;
  constructor(
    tableName: string,
    metadata: ModelMetadata<NodePackage>,
    adapter: IDBAdapter<DBModel>,
    nodeTable: NodeTable,
  ) {
    super(tableName, metadata, adapter);
    this.nodeTable = nodeTable;
  }

  protected async hasWriteAccessToItem(
    scope: "delete" | "update" | "create",
    item: NodePackage,
    userSession: SessionUser | null,
  ): Promise<boolean> {
    if (userSession?.isPowerUser || userSession?.isAdmin) return true;
    const isGitRepoOwner =
      userSession?.provider == "github" &&
      userSession?.login == item.gitRepo.split("/")[0];
    return isGitRepoOwner;
  }

  public async listJoinNodes(limit?: number, nextToken?: string) {
    const MAX_NODES = 5;
    const packages = await this.listAll(limit, nextToken);
    const packagesWNodes = packages.items.map(async (pack) => {
      const node_names = await this.nodeTable
        .listByIndex(null, "packageID", pack.id)
        .then((nodes) => {
          return nodes.map((n) => n.id);
        });
      return {
        ...pack,
        nodes: node_names.slice(0, MAX_NODES),
        totalNodes: node_names.length,
        nextToken: packages.nextToken,
      };
    });
    const items = await Promise.all(packagesWNodes);
    const filered = items
      .filter((i) => i.totalNodes > 0)
      .sort((a, b) => b.totalStars - a.totalStars);
    return filered;
  }
  public async homeImportFailedList(limit?: number, nextToken?: string) {
    const q = {
      query: {
        term: {
          "status.keyword": {
            value: "IMPORT_FAILED",
          },
        },
      },
      size: limit,
    };
    const res = await queryOpensearch(q, "comfynodepackage");
    return res.hits.map((hit) => hit._source);
  }

  public async homePopularList(
    limit?: number,
    nextToken?: string,
  ): Promise<NodePackage[]> {
    const q = {
      query: {
        bool: {
          must: {
            match_all: {}, // Keeps your original match_all query
          },
        },
      },
      sort: [
        {
          totalStars: {
            order: "desc", // Sorting by totalStars in descending order
          },
        },
      ],
      size: limit,
    };
    const res = await queryOpensearch(q, "comfynodepackage");
    return res.hits.map((hit) => hit._source);
  }
}
