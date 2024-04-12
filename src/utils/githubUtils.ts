export function sanitizeGithubHtmlUrl(repoUrl: string): string {
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

export async function checkGitRepoExists(url: string): Promise<boolean> {
  try {
    // Fetch the repository from GitHub API using the provided URL
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    });

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
