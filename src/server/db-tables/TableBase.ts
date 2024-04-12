import type { DBModel, ModelMetadata } from "../dbTypes";
import { IDBAdapter } from "../db-adapters/IDBAdapter";
import { nanoid } from "nanoid";
import { Session, SessionUser } from "next-auth";

export class TableBase<T extends DBModel> {
  protected tableName: string;
  protected metadata: ModelMetadata<T>;
  protected adapter: IDBAdapter<DBModel>;

  constructor(
    tableName: string,
    metadata: ModelMetadata<T>,
    adapter: IDBAdapter<DBModel>,
  ) {
    const tablePostfix = process.env.DDB_TABLE_POSTFIX ?? "";
    this.tableName = tableName + tablePostfix;
    this.metadata = metadata;
    this.adapter = adapter;
  }

  protected async hasReadAccessToItem(
    item: T,
    userSession: SessionUser | null,
  ) {
    return true;
  }

  protected async hasWriteAccessToItem(
    scope: "delete" | "update" | "create",
    item: T,
    userSession: Session["user"] | null,
  ) {
    if (scope === "create") return true;
    // only owner can update/delete
    if (!userSession) return false;
    if (userSession.isPowerUser) return true;
    return "authorID" in item ? item.authorID === userSession.id : false;
  }

  async listAll(
    limit = 50,
    nextToken?: string,
    userSession?: SessionUser,
  ): Promise<{ items: T[]; nextToken?: string | null }> {
    try {
      let data = await this.adapter.listAll(this.tableName, limit, nextToken);

      const filterAccess = await Promise.all(
        data.items.map(async (item) => {
          if (await this.hasReadAccessToItem(item as T, userSession ?? null))
            return item;
          return null;
        }),
      );
      data.items = filterAccess.filter((item) => item !== null) as T[];

      return data as { items: T[]; nextToken?: string | null };
    } catch (err) {
      console.error(
        "Unable to scan the table. Error:",
        JSON.stringify(err, null, 2),
      );
      throw err;
    }
  }

  async listByIndex<K extends Extract<keyof T, string>>(
    userSession: Session["user"] | null,
    indexPk: K,
    eq: string, // equals value,
    sortOrder: "ASC" | "DESC" = "ASC",
    limit = 50,
  ): Promise<T[]> {
    try {
      const result = await this.adapter.listByIndex(
        this.tableName,
        indexPk,
        eq,
        limit,
        sortOrder,
      );

      const filterAccess = await Promise.all(
        result.items.map(async (item) => {
          if (await this.hasReadAccessToItem(item as T, userSession ?? null))
            return item;
          return null;
        }),
      );
      result.items = filterAccess.filter((item) => item !== null) as T[];

      // const filerItemFieldsPromises = (result.items as T[]).map(
      //   async (item) => {
      //     // remove private fields
      //     const copyItem = { ...item };
      //     if (
      //       !(await this.hasWriteAccessToItem(
      //         "update",
      //         item,
      //         userSession ?? null,
      //       ))
      //     ) {
      //       this.metadata.privateFields?.forEach((field) => {
      //         delete (copyItem as any)[field];
      //       });
      //     }
      //     return copyItem as T;
      //   },
      // );
      // result.items = await Promise.all(filerItemFieldsPromises);
      return result.items as T[];
    } catch (error) {
      console.error("Error in listByIndex operation:", error);
      return [];
    }
  }

  async get(
    pkValue: string,
    userSession?: SessionUser | null,
  ): Promise<T | null> {
    const item = (await this.adapter.get(this.tableName, pkValue)) as T | null;
    if (!item) return null;
    if (!(await this.hasReadAccessToItem(item, userSession ?? null))) {
      console.warn("No access to item [" + pkValue + "]");
      return null;
    }
    // remove private fields
    if (
      !(await this.hasWriteAccessToItem("update", item, userSession ?? null))
    ) {
      this.metadata.privateFields?.forEach((field) => {
        delete (item as any)[field];
      });
    }
    return item as T;
  }

  async create(
    params: Omit<T, "id" | "createdAt" | "updatedAt"> & {
      id?: string;
    },
    userSession: SessionUser | null,
  ): Promise<T | null> {
    const item: T = {
      id: params.id ?? this.generateId(), // Generate a unique ID if not provided
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...params,
    } as T;
    try {
      const hasCreateAccess = await this.hasWriteAccessToItem(
        "create",
        item,
        userSession ?? null,
      );
      if (!hasCreateAccess) {
        return null;
      }
      const newItem = await this.adapter.create(this.tableName, item);
      return newItem as T;
    } catch (error) {
      console.error("Error in create operation:", error);
      return null;
    }
  }

  async update(
    id: string,
    updateData: Partial<T>,
    userSession: SessionUser | null,
  ): Promise<T | null> {
    const flow = (await this.get(id, userSession)) as T;
    if (
      !(await this.hasWriteAccessToItem("update", flow, userSession ?? null))
    ) {
      throw new Error("No access to update");
    }

    const item: T = {
      updatedAt: new Date().toISOString(),
      ...updateData,
    } as T;
    try {
      const newItem = await this.adapter.update(this.tableName, id, item);
      return newItem as T;
    } catch (error) {
      console.error("Error in update operation:", error);
      throw new Error(`Failed to update: ${JSON.stringify(error)}`);
    }
  }

  async put(userSession: SessionUser | null, item: T): Promise<T | null> {
    const idExists = await this.exists__BypassAccessControl(item.id);
    if (
      idExists &&
      !(await this.hasWriteAccessToID(userSession ?? null, "update", item.id))
    ) {
      throw new Error("No access to update");
    }
    if (
      !idExists &&
      !(await this.hasWriteAccessToItem("create", item, userSession ?? null))
    ) {
      throw new Error("No access to create");
    }

    const updateItem: T = {
      ...item,
      updatedAt: new Date().toISOString(),
    } as T;
    if (!idExists) {
      updateItem.createdAt = new Date().toISOString();
    }
    try {
      const newItem = await this.adapter.put(this.tableName, updateItem);
      return newItem as T;
    } catch (error) {
      console.error("Error in update operation:", error);
      throw new Error(`Failed to update: ${JSON.stringify(error)}`);
    }
  }

  // !!This bypasses the access control check
  async exists__BypassAccessControl(id: string): Promise<boolean> {
    const item = (await this.adapter.get(this.tableName, id)) as T | null;
    return item == null;
  }

  async delete(id: string, userSession: SessionUser | null): Promise<boolean> {
    const flow = (await this.get(id, userSession)) as T;
    if (
      !(await this.hasWriteAccessToItem("delete", flow, userSession ?? null))
    ) {
      console.error(`No access to delete`);
      throw new Error("No access to delete");
    }
    try {
      const res = (await this.adapter.delete(this.tableName, id)) ?? false;
      return res;
    } catch (error) {
      console.error("Error in delete operation:", error);
      throw new Error(`Failed to delete: ${JSON.stringify(error)}`);
    }
  }

  private generateId(): string {
    return nanoid();
  }
  async hasReadAccessToID(
    id: string,
    userSession: SessionUser | null,
  ): Promise<boolean> {
    const item = await this.get(id, userSession);
    return item != null;
  }
  async hasWriteAccessToID(
    userSession: SessionUser | null,
    scope: "update" | "delete" | "create",
    id: string,
  ): Promise<boolean> {
    const item = await this.get(id, userSession);
    return (
      item != null &&
      (await this.hasWriteAccessToItem(scope, item, userSession))
    );
  }
}
