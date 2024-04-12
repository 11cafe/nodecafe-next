const path = require("path");
const fs = require("fs");
const ignore = require("ignore");

// Function to read .gitignore and create an ignore filter
function createIgnoreFilter(sourceFolder) {
  const gitignorePath = path.join(sourceFolder, ".gitignore");
  let ignoreFilter = ignore();
  try {
    const gitignoreContents = fs.readFileSync(gitignorePath, "utf8");
    ignoreFilter.add(gitignoreContents);
  } catch (err) {
    console.error(`Failed to read .gitignore: ${err}`);
  }
  return ignoreFilter;
}

// Function to copy files recursively
function copyFilesRecursively(sourceFolder, destinationFolder, ignoreFilter) {
  // Create the destination folder if it doesn't exist
  if (!fs.existsSync(destinationFolder)) {
    fs.mkdirSync(destinationFolder);
  }

  // Read the contents of the source folder
  const files = fs.readdirSync(sourceFolder);

  files.forEach((file) => {
    const sourcePath = path.join(sourceFolder, file);
    const destinationPath = path.join(destinationFolder, file);
    const relativePath = path.relative(sourceFolder, sourcePath);

    // Skip the .git folder, comfyui-fork folder, and .gitignore file
    if (
      file === ".git" ||
      file === "comfyui-fork" ||
      file === ".gitignore" ||
      ignoreFilter.ignores(relativePath)
    ) {
      return;
    }
    try {
      // If the file is a directory, recursively copy its contents
      if (fs.lstatSync(sourcePath).isDirectory()) {
        copyFilesRecursively(sourcePath, destinationPath, ignoreFilter);
      } else {
        // Copy the file to the destination folder
        fs.copyFileSync(sourcePath, destinationPath);
        console.log(`Copied ${sourcePath} to ${destinationPath}`);
      }
    } catch (err) {
      console.error(`Failed to copy ${sourcePath}: ${err}`);
    }
  });
}

// Function to sync files from the private repo folder to the public repo
function syncFilesFromFolder(
  sourceFolderRelativePath,
  destinationFolderRelativePath,
) {
  const sourceFolder = path.resolve(__dirname, sourceFolderRelativePath);
  const destinationFolder = path.resolve(
    __dirname,
    destinationFolderRelativePath,
  );
  const ignoreFilter = createIgnoreFilter(sourceFolder);

  copyFilesRecursively(sourceFolder, destinationFolder, ignoreFilter);
  console.log("Files have been synchronized!");
}

// Define the relative paths from the script's location
const sourceFolderRelativePath = "../"; // Assuming you want to sync the entire nodecafe_private folder
const destinationFolderRelativePath = "../../nodecafe-next/";

// Execute the sync function
syncFilesFromFolder(sourceFolderRelativePath, destinationFolderRelativePath);
