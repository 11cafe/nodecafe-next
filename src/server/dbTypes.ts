interface DynaModel {
  // Define common attributes here, like ID
}
interface Media extends DynaModel {
  id: string;
  imageUrl: string;
  workflowID: string | null;
  privacy: "public" | "private";
}
type StringKeyOf<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

export type dbResponse<T> = {
  data?: T;
  error?: string;
};

export interface ModelMetadata<T> {
  pk?: StringKeyOf<T>; // primary key, default is "id", must be of type string
  indexes?: Array<keyof T>;
  privateFields?: Array<keyof T>;
}

export enum EWorkflowPrivacy {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
  UNLISTED = "UNLISTED",
}

export interface Workflow extends DBModel {
  id: string;
  name: string;
  imageUrl?: string;
  description?: string;
  authorID: string;
  latestVersionID: string;
  privacy: EWorkflowPrivacy;
  nodes: string;
  deps: string | null;
}

export interface TempData extends DBModel {
  id: string;
  data: string;
}
export interface WorkflowVersion extends DBModel {
  id: string;
  name: string;
  authorID: string;
  workflowID: string;
  json: string;
  nodeDefs: string;
}

export enum ENodePackageStatus {
  PENDING = "PENDING",
  IMPORT_SUCCESS = "IMPORT_SUCCESS",
  IMPORT_FAILED = "IMPORT_FAILED",
  TEST_WORKFLOW_SUCCESS = "TEST_WORKFLOW_SUCCESS",
  TEST_WORKFLOW_FAILED = "TEST_WORKFLOW_FAILED",
  VERIFIED = "VERIFIED",
}
export interface NodePackage extends DBModel {
  id: string;
  gitRepo: string;
  totalInstalls?: number;
  totalStars: number;
  status: ENodePackageStatus;
  importTime?: number;
  installTime?: number;
  importError: string | null;
  createdAt: string;
  nameID: string;
  totalNodes: number;
  description: string;
  ownerGitAvatarUrl: string | null;
  latestCommit: string | null;
}

export interface ComfyUser extends DBModel {
  id: string;
  email: string;
  username: string;
  imageUrl: string | null;
  updatedAt: string;
  createdAt: string;
  provider: string;
  oauthSub: string; // oauth sub "github_123456"
}

export interface ComfyPackageComment extends DBModel {
  id: string;
  packageID: string;
  authorID: string;
  updatedAt: string;
  createdAt: string;
  content: string;
}

export interface DBModel {
  id: string;
  updatedAt?: string;
  createdAt?: string;
}
export interface ModelFileDB extends DBModel {
  id: string;
  filename: string;
  filehash: string;
  folderName: string;
  downloadUrl: string;
  downloadUrls: string[];
  civitID: string | null;
  civitVersionID: string | null;
}
export interface ComfyNode extends DBModel {
  id: string;
  packageID: string;
  nodeDef: string;
  nodeType: string;
  gitRepo: string;
  folderPaths?: string | null; //json string looks like {"vae_name": {"folder_name": "vae", "abs_path": [["comfyui/models/vae"], [".ckpt", ".pt", ".pth", ".safetensors", ".bin"]]}}
}
export type ElasticSearchHit<T> = {
  _id: string;
  _index: string;
  _score: number;
  _source: T;
  _type: string;
};

export type ElasticSearchResult<T> = {
  hits: ElasticSearchHit<T>[];
  total: {
    relation?: string;
    value: number;
  };
};

export type NodeFolderPath = {
  abs_path?: string[][];
  folder_name: string;
};

export interface ListResponse<T> {
  items?: T[];
  nextToken?: string | null;
  error?: string;
}
