interface RepoData {
  stars: number;
  owner_avatar_url: string;
  description: string;
}

async function getGithubRepoStars(repoUrl: string): Promise<RepoData> {
  const githubKey = process.env.GITHUB_API_KEY;

  if (!githubKey) {
    console.log("🔴🔴 No GitHub API key provided!!");
    return {
      stars: 0,
      owner_avatar_url: "",
      description: "",
    };
  }

  // Extracting the owner and repo name from the URL
  const parts = repoUrl.split("/");
  const owner = parts[parts.length - 2];
  const repo = parts[parts.length - 1];

  // GitHub API endpoint for fetching repo details
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
  const headers = {
    Authorization: `token ${githubKey}`, // Adding the authentication token to the request header
    Accept: "application/vnd.github.v3+json",
  };

  try {
    // Making the authenticated request
    const response = await fetch(apiUrl, { headers });

    if (response.ok) {
      // Extracting the number of stars and owner avatar URL
      const repoData = await response.json();
      const stars = repoData.stargazers_count || 0;
      const ownerAvatarUrl = repoData.owner.avatar_url;

      let description = repoData.description;

      if (!description) {
        // Fetch README content
        const readmeUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;
        const readmeInfo = await fetch(readmeUrl, { headers });

        if (readmeInfo.ok) {
          const readmeData = await readmeInfo.json();
          const readmeContent = readmeData.content || "";

          let readmeText = "";
          if (readmeData.download_url) {
            const readmeResponse = await fetch(readmeData.download_url);
            readmeText = await readmeResponse.text();
          }

          const paragraphs = readmeText.split("\n\n");
          // Keep only the first two paragraphs
          const firstTwoParagraphs = paragraphs.slice(0, 2);
          description = firstTwoParagraphs.join("\n");
        }
      }

      return {
        stars,
        owner_avatar_url: ownerAvatarUrl,
        description,
      };
    } else {
      console.log(
        `Failed to retrieve repository data. Status Code: ${response.status}`,
      );
      return {
        stars: 0,
        owner_avatar_url: "",
        description: "",
      };
    }
  } catch (error) {
    console.error("Error retrieving repository data:", error);
    return {
      stars: 0,
      owner_avatar_url: "",
      description: "",
    };
  }
}
