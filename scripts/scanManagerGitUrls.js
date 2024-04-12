const COMFYUI_MANAGER_NODES_URL =
  "https://raw.githubusercontent.com/ltdrdata/ComfyUI-Manager/main/custom-node-list.json";

require("dotenv").config({ path: "../.env.local" });

async function scanManagerGitUrls() {
  const nodelist = await fetch(COMFYUI_MANAGER_NODES_URL).then((res) =>
    res.json(),
  );

  for (let index = 5; index < 100; index++) {
    const node = nodelist.custom_nodes[index];

    const gitHtmlUrl = sanitizeGithubHtmlUrl(node.reference);
    console.log("valided:", gitHtmlUrl);
    // const validRepo = await checkGitRepoExists(gitHtmlUrl);
    // if (!validRepo) {
    //   return;
    // }
    const runpodUrl = `${process.env.RUNPOD_API_URL}/runsync`;
    const runpodRes = await fetch(runpodUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RUNPOD_API_KEY}`,
      },
      body: JSON.stringify({
        input: {
          scannerGitUrl: gitHtmlUrl,
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(`✅finished job: ${gitHtmlUrl}`, data))
      .catch((error) => console.error(error));
  }
}

scanManagerGitUrls();

function sanitizeGithubHtmlUrl(repoUrl) {
  let url = repoUrl;
  url = url.trim();
  if (!url || !url.startsWith("https://github.com/")) {
    throw new Error("Invalid github url");
  }
  if (url.endsWith(".git")) {
    url = url.slice(0, -4);
  }
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }
  const parts = url.split("/");
  const repo = parts.pop();
  const username = parts.pop();
  if (!repo || !username) {
    throw new Error("Invalid github url");
  }
  const gitHtmlUrl = `https://github.com/${username}/${repo}`;
  return gitHtmlUrl;
}

async function checkGitRepoExists(url) {
  try {
    // Fetch the repository from GitHub API using the provided URL
    const response = await fetch(url);
    console.log("response:", response);
    // Check if the repository is accessible
    if (response.ok) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error checking repository:", error);
    return false;
  }
}
