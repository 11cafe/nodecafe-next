const fs = require("fs-extra");

const sourceDir = "./comfyui-fork/web";
const destDir = "./public/web";
// Check if the destination directory exists
fs.pathExists(destDir)
  .then((exists) => {
    if (!exists) {
      console.log("Destination does not exist. Proceeding to copy.");
      return fs.copy(sourceDir, destDir);
    }
    // If the destination exists, check if it's a symlink
    return fs.lstat(destDir).then((stats) => {
      if (stats.isSymbolicLink()) {
        console.log("Destination is a symlink. Skipping copy.");
      } else {
        console.log("Destination is not a symlink. Proceeding to copy.");
        return fs.copy(sourceDir, destDir);
      }
    });
  })
  .then(() => console.log("Operation completed successfully."))
  .catch((err) => console.error(err));
