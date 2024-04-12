import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { ApiResponse, ShareWorkflowData } from "@/types/ApiTypes";
import {
  Alert,
  AlertIcon,
  HStack,
  Heading,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import type {
  createCloudflowRequest,
  createCloudflowResponse,
} from "../api/createCloudflow";
import LoginModal from "@/components/auth/LoginModal";

export default function Page() {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const sharing = useRef(false);
  const { data: session, status } = useSession();
  const createSharedCloudflow = async (inputData: ShareWorkflowData) => {
    if (sharing.current) {
      // only share once
      return;
    }
    sharing.current = true;
    const cloudflowResp = await fetch("/api/createCloudflow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputData),
    });
    const resJson = (await cloudflowResp.json()) as createCloudflowResponse;
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get("redirectUrl") ?? "";
    if (resJson.data?.id) {
      // send success message to comfyui client
      window.opener.postMessage(
        {
          type: "share_workflow_success",
          version: resJson.data,
          localWorkflowID: inputData.workflow.id,
          localVersionID: inputData.version.id,
        },
        redirectUrl,
      );

      window.close();
    } else {
      setError(
        resJson.error ??
          "Failed to create workflow! Please make sure you have write access to this workflow and try again.",
      );
    }
  };
  useEffect(() => {
    if (!session) {
      return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const redirectUrl = urlParams.get("redirectUrl") ?? "";
    window.addEventListener("message", (event) => {
      if (!event.origin.includes(redirectUrl)) {
        return;
      }
      createSharedCloudflow(event.data);
    });
    window.opener.postMessage("child_ready", redirectUrl);

    // window.addEventListener("blur", function () {
    //   window.close();
    // });
  }, [session]);

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }
  if (!session) {
    return <LoginModal onClose={() => {}} />;
  }
  return (
    <Stack>
      <Head>
        <title>Share Workflow</title>
      </Head>
      <HStack>
        <Spinner />
        <Heading size={"sm"}>Sharing Workflow...</Heading>
      </HStack>
    </Stack>
  );
}
