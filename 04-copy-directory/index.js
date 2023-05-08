const fs = require('fs');
const path = require('path');

function copyDir(source, destination) {
  // create destination directory if it doesn't exist
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  // get list of files in source directory
  const sourceFiles = fs.readdirSync(source);

  // get list of files in destination directory
  const destFiles = fs.readdirSync(destination);

  // remove files from destination that no longer exist in source
  destFiles.forEach((file) => {
    if (!sourceFiles.includes(file)) {
      const filePath = path.join(destination, file);
      fs.unlinkSync(filePath);
    }
  });

  // copy each file in source directory to destination directory
  sourceFiles.forEach((file) => {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);
    const stats = fs.statSync(sourcePath);
    if (stats.isFile()) {
      const readStream = fs.createReadStream(sourcePath);
      const writeStream = fs.createWriteStream(destPath);
      readStream.pipe(writeStream);
    } else if (stats.isDirectory()) {
      copyDir(sourcePath, destPath);
    }
  });
}

copyDir('04-copy-directory/files', '04-copy-directory/files-copy');
