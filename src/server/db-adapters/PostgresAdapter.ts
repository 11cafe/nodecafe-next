import { Pool } from "pg";
import { IDBAdapter } from "./IDBAdapter";

export class PostgresAdapter<T> implements IDBAdapter<T> {
  private pool: Pool;
  constructor() {
    this.pool = new Pool({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: parseInt(process.env.PGPORT || "5432"),
    });
  }

  async listAll(
    tableName: string,
    limit: number = 10,
    nextToken?: string,
  ): Promise<{ items: T[]; nextToken?: string }> {
    let query = `SELECT * FROM "${tableName}"`;
    const values: any[] = [];

    if (nextToken) {
      query += ` WHERE id > $1`;
      values.push(nextToken);
    }

    query += ` ORDER BY id LIMIT $${values.length + 1}`;
    values.push(limit);

    const { rows } = await this.pool.query(query, values);
    const nextTokenValue =
      rows.length === limit ? rows[rows.length - 1].id : undefined;

    return { items: rows, nextToken: nextTokenValue };
  }

  async get(tableName: string, id: string): Promise<T | null> {
    const { rows } = await this.pool.query(
      `SELECT * FROM "${tableName}" WHERE id = $1`,
      [id],
    );
    if (rows.length === 0) return null;
    return rows[0];
  }

  async delete(tableName: string, id: string): Promise<boolean> {
    const { rowCount } = await this.pool.query(
      `DELETE FROM "${tableName}" WHERE id = $1`,
      [id],
    );
    return rowCount ? rowCount > 0 : false;
  }

  async create(
    tableName: string,
    item: Omit<T, "createdAt" | "updatedAt">,
  ): Promise<T> {
    const columns = Object.keys(item).map((key) => `"${key}"`);
    const values = Object.values(item);
    const placeholders = values.map((_, i) => `$${i + 1}`);
    const { rows } = await this.pool.query(
      `INSERT INTO "${tableName}"(${columns.join(
        ", ",
      )}) VALUES(${placeholders.join(", ")}) RETURNING *`,
      values,
    );

    return rows[0];
  }

  async put(
    tableName: string,
    item: Omit<T, "createdAt" | "updatedAt">,
  ): Promise<T> {
    const columns = Object.keys(item);
    const values = Object.values(item);
    const idIndex = columns.indexOf("id");
    const placeholders = columns.map((_, i) => `"${columns[i]}" = $${i + 1}`);

    const query = `UPDATE "${tableName}" SET ${placeholders.join(
      ", ",
    )} WHERE id = $${idIndex + 1} RETURNING *`;

    const { rows } = await this.pool.query(query, values);

    return rows[0];
  }

  async update(tableName: string, id: string, item: Partial<T>): Promise<T> {
    const entries = Object.entries(item);
    const setClause = entries
      .map(([key], index) => `"${key}" = $${index + 2}`)
      .join(", ");
    const values = entries.map(([, value]) => value);

    const { rows } = await this.pool.query(
      `UPDATE "${tableName}" SET ${setClause} WHERE id = $1 RETURNING *`,
      [id, ...values],
    );

    return rows[0];
  }

  async listByIndex(
    tableName: string,
    columnName: string,
    value: any,
    limit: number = 10,
    nextToken?: string,
  ): Promise<{ items: T[]; nextToken?: string }> {
    let query = `SELECT * FROM "${tableName}" WHERE "${columnName}" = $1`;
    const values: any[] = [value];

    if (nextToken) {
      query += ` AND id > $2 ORDER BY id LIMIT $3`;
      values.push(nextToken, limit);
    } else {
      query += ` ORDER BY id LIMIT $2`;
      values.push(limit);
    }

    const { rows } = await this.pool.query(query, values);
    const nextTokenValue =
      rows.length === limit ? rows[rows.length - 1].id : undefined;

    return { items: rows, nextToken: nextTokenValue };
  }
}
