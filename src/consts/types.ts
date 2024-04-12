export type PromptParams = {
  prompt: string;
  [key: string]: any;
};

export type ModelInput = {
  prompt?: string;
  [key: string]: any;
};

export type ModelFile = {
  filename: string;
  fileFolder: string | null;
  fileHash: string | null;
  downloadUrl: string | null;
  // optional info
  infoUrl: string | null;
  nodeType?: string;
  inputName?: string;
};

type ImageFile = {
  filename: string;
  nodeType: string;
  url?: string;
};
type NodeRepo = {
  commitHash: string;
  gitRepo: string;
};

export type DepsResult = {
  models: Record<string, ModelFile>;
  images: Record<string, ImageFile>;
  nodeRepos: NodeRepo[];
};
