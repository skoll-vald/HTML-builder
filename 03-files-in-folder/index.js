const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.log('Error reading directory:', err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.log('Error getting file stats:', err);
        return;
      }

      if (stats.isFile()) {
        const sizeInKB = Math.round(stats.size / 1024 * 100) / 100;
        const ext = path.extname(file).replace('.', '');
        console.log(`${path.parse(file).name} - ${ext} - ${sizeInKB}kb`);
      }
    });
  });
});
