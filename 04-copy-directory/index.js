const fs = require('fs');
const path = require('path');

async function copyDir(source, destination) {
  try {
    // create destination directory if it doesn't exist
    if (!fs.existsSync(destination)) {
      await fs.promises.mkdir(destination, { recursive: true });
    }

    // get list of files in source directory
    const sourceFiles = await fs.promises.readdir(source);

    // get list of files in destination directory
    const destFiles = await fs.promises.readdir(destination);

    // remove files from destination that no longer exist in source
    for (const file of destFiles) {
      if (!sourceFiles.includes(file)) {
        const filePath = path.join(destination, file);
        await fs.promises.unlink(filePath);
      }
    }

    // copy each file in source directory to destination directory
    for (const file of sourceFiles) {
      const sourcePath = path.join(source, file);
      const destPath = path.join(destination, file);
      const stats = await fs.promises.stat(sourcePath);
      if (stats.isFile()) {
        const readStream = fs.createReadStream(sourcePath);
        const writeStream = fs.createWriteStream(destPath);
        await new Promise((resolve, reject) => {
          readStream.pipe(writeStream)
            .on('finish', () => {
              resolve();
            })
            .on('error', (error) => {
              reject(error);
            });
        });
      } else if (stats.isDirectory()) {
        await copyDir(sourcePath, destPath);
      }
    }
  } catch (error) {
    console.error(`Error copying directory: ${error}`);
  }
}

copyDir('04-copy-directory/files', '04-copy-directory/files-copy');
