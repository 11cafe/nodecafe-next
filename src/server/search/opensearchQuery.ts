import {
  ComfyNode,
  ElasticSearchResult,
  NodePackage,
  Workflow,
} from "@/server/dbTypes";
import { Client } from "@opensearch-project/opensearch";
import { AwsSigv4Signer } from "@opensearch-project/opensearch/aws";

type OpensearchIndexType = "comfynodepackage" | "comfynode" | "cloudflow";

const awsRegion = process.env.AWS_REGION;
const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const opensearchDomain = process.env.AWS_OPENSEARCH_DOMAIN;
if (awsRegion == null || awsAccessKeyId == null || awsSecretAccessKey == null) {
  throw new Error("AWS credentials not set");
}
const client = new Client({
  ...AwsSigv4Signer({
    region: awsRegion,
    service: "es", // 'aoss' for OpenSearch Serverless
    getCredentials: () => {
      return Promise.resolve({
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
      });
    },
  }),
  node: opensearchDomain, // OpenSearch domain URL
});

type OpensearchIndexMapping = {
  comfynode: ComfyNode;
  comfynodepackage: NodePackage;
  cloudflow: Workflow;
};

export default async function queryOpensearch<K extends OpensearchIndexType>(
  queryObj: Object,
  index: K,
): Promise<ElasticSearchResult<OpensearchIndexMapping[K]>> {
  try {
    let response = await client.search({
      index: index,
      body: queryObj,
    });
    return response.body.hits;
  } catch (error) {
    console.error(error);
    return {
      total: {
        value: 0,
      },
      hits: [],
    };
  }
}
