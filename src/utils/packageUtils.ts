export const gitUsernameFromGitUrl = (gitUrl: string) => {
  const match = gitUrl.match(/github\.com\/([^/]+)/);
  if (match == null) {
    return null;
  }
  return match[1];
};
