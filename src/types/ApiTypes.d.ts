import { EWorkflowPrivacy } from "@/server/dbTypes";

export interface Request {
  id?: string;
  imageUrl: string;
  privacy: "public" | "private";
}

export interface Response {
  message: string;
  data?: any; // Replace with a more specific type if available
}

export type CreateParams<T> = Omit<T, "id" | "createdAt" | "updatedAt"> & {
  id?: string;
};

export interface CreateResponse<T> {
  data?: T | null;
  error?: string;
}

export interface DeleteResponse {
  error?: string;
}
export type DeleteParams = {
  id: string;
};

export type ShareWorkflowData = {
  version: {
    id: string;
    name: string;
    workflowID: string;
    json: string;
    cloudID?: string;
  };
  workflow: {
    id: string;
    name: string;
    cloudID?: string;
  };
  nodeDefs: Object;
  privacy: EWorkflowPrivacy;
};
export type ApiResponse<T> = {
  data?: T;
  error?: string;
  code?: string; //error code
};
