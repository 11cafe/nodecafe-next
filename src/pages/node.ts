// pages/node.js
import { dbTables } from "@/server/db-tables/dbTables";
import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const type = query.type as string;

  // Perform your query here based on the type
  const node = (await dbTables.node?.listByIndex(null, "nodeType", type))?.at(
    0,
  );
  if (!node) {
    return {
      notFound: true,
    };
  }
  // Redirect to /package/xyz?node=xxx
  return {
    redirect: {
      destination: `/package/${node.packageID}?node=${encodeURIComponent(type)}`,
      permanent: false, // Temporary redirect, set to true if it's permanent
    },
  };
};
export default function Page() {
  return null;
}
