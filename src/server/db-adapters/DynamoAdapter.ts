import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
  ScanCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { IDBAdapter } from "./IDBAdapter";

export class DynamoAdapter<T> implements IDBAdapter<T> {
  private client: DynamoDBDocumentClient;

  constructor() {
    const dynamoDBClient = new DynamoDBClient({});
    this.client = DynamoDBDocumentClient.from(dynamoDBClient);
  }

  async listAll(
    tableName: string,
    limit?: number,
    nextToken?: string,
  ): Promise<{ items: T[]; nextToken?: string }> {
    const params: any = {
      TableName: tableName,
      Limit: limit,
      ExclusiveStartKey: nextToken
        ? JSON.parse(Buffer.from(nextToken, "base64").toString("ascii"))
        : undefined,
    };

    const result = await this.client.send(new ScanCommand(params));
    return {
      items: result.Items as T[],
      nextToken: result.LastEvaluatedKey
        ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString(
            "base64",
          )
        : undefined,
    };
  }

  async get(tableName: string, id: string): Promise<T | null> {
    const result = await this.client.send(
      new GetCommand({
        TableName: tableName,
        Key: { id },
      }),
    );

    return result.Item ? (result.Item as T) : null;
  }

  async delete(tableName: string, id: string): Promise<boolean> {
    const result = await this.client.send(
      new DeleteCommand({
        TableName: tableName,
        Key: { id },
        ReturnValues: "ALL_OLD",
      }),
    );
    return !!result;
  }

  async create(
    tableName: string,
    item: Omit<T, "createdAt" | "updatedAt">,
  ): Promise<T> {
    const timestamp = new Date().toISOString();
    const newItem = {
      ...item,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await this.client.send(
      new PutCommand({
        TableName: tableName,
        Item: newItem,
        ConditionExpression: "attribute_not_exists(id)",
      }),
    );

    return newItem as T;
  }

  async put(
    tableName: string,
    item: Omit<T, "createdAt" | "updatedAt">,
  ): Promise<T> {
    const updatedItem = {
      ...item,
      updatedAt: new Date().toISOString(),
    };

    await this.client.send(
      new PutCommand({
        TableName: tableName,
        Item: updatedItem,
      }),
    );

    return updatedItem as T;
  }

  async update(tableName: string, id: string, item: Partial<T>): Promise<T> {
    const updateExpression = Object.keys(item)
      .map((key) => `#${key} = :${key}`)
      .join(", ");

    const expressionAttributeNames = Object.keys(item).reduce(
      (acc, key) => ({
        ...acc,
        [`#${key}`]: key,
      }),
      {},
    );

    const expressionAttributeValues = Object.keys(item).reduce(
      (acc, key) => ({
        ...acc,
        [`:${key}`]: (item as any)[key],
      }),
      {},
    );

    const result = await this.client.send(
      new UpdateCommand({
        TableName: tableName,
        Key: { id },
        UpdateExpression: `set ${updateExpression}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW",
      }),
    );

    return result.Attributes as T;
  }

  async listByIndex(
    tableName: string,
    columnName: string,
    value: any,
    limit?: number,
    sortOrder?: "ASC" | "DESC",
    nextToken?: string,
  ): Promise<{ items: T[]; nextToken?: string }> {
    const params: any = {
      TableName: tableName,
      IndexName: `${columnName}`,
      KeyConditionExpression: `${columnName} = :v`,
      ExpressionAttributeValues: {
        ":v": value,
      },
      Limit: limit,
      ExclusiveStartKey: nextToken
        ? JSON.parse(Buffer.from(nextToken, "base64").toString("ascii"))
        : undefined,
      ScanIndexForward: sortOrder === "ASC",
    };

    const result = await this.client.send(new QueryCommand(params));
    return {
      items: result.Items as T[],
      nextToken: result.LastEvaluatedKey
        ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString(
            "base64",
          )
        : undefined,
    };
  }
}
