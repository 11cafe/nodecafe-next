export interface IDBAdapter<T> {
  listAll(
    tableName: string,
    limit?: number,
    nextToken?: string,
  ): Promise<{ items: T[]; nextToken?: string }>;
  get(tableName: string, id: string): Promise<T | null>;
  delete(tableName: string, id: string): Promise<boolean>;
  create(
    tableName: string,
    item: Omit<T, "createdAt" | "updatedAt">,
  ): Promise<T>;
  put(tableName: string, item: Omit<T, "createdAt" | "updatedAt">): Promise<T>;
  update(tableName: string, id: string, item: Partial<T>): Promise<T>;
  listByIndex(
    tableName: string,
    columnName: string,
    value: any,
    limit?: number,
    sortOrder?: "ASC" | "DESC",
    nextToken?: string,
  ): Promise<{ items: T[]; nextToken?: string }>;
}
