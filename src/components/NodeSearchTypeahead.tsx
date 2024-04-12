import { useEffect, useRef, useState } from "react";
import {
  Text,
  Input,
  Box,
  Link as ChakraLink,
  Card,
  Stack,
  Divider,
  Spinner,
  useOutsideClick,
  Link,
} from "@chakra-ui/react";
import { useDebounce } from "./hooks/useDebounce";
import { ComfyNode, ElasticSearchResult } from "@/server/dbTypes";

type SearchRes = {
  id: string;
  type: string;
  name: string;
};
export default function NodeSearchTypeahead() {
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick({
    ref: ref,
    handler: () => {
      setQuery("");
    },
  });
  const [res, setRes] = useState<ComfyNode[]>();
  const debouncedQuery = useDebounce(query, 400); // 500ms delay
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (debouncedQuery.length == 0) {
      setRes([]);
      return;
    }
    setIsLoading(true);
    fetch("/api/searchNode?query=" + debouncedQuery)
      .then((res) => res.json())
      .then((res: ElasticSearchResult<ComfyNode>) => {
        setRes(res?.hits?.map((hit) => hit._source) ?? []);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [debouncedQuery]);
  return (
    <Box position={"relative"} overflow={"visible"} ref={ref}>
      <Input
        size={"md"}
        value={query}
        placeholder={"Search"}
        width={["200px", "300px"]}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query.length != 0 && (
        <Card
          position={"absolute"}
          top={"50px"}
          p={2}
          zIndex={2}
          width={"300px"}
          overflowY={"scroll"}
          maxH={"700px"}
        >
          {isLoading && <Spinner />}
          {!isLoading && res && res.length == 0 && <Text> No results</Text>}
          <Stack gap={1} divider={<Divider />}>
            {res?.map((item) => (
              <Link href={"/package/" + item.id} key={item.id}>
                {item.gitRepo.split("/")[1]}
              </Link>
            ))}
          </Stack>
        </Card>
      )}
    </Box>
  );
}
