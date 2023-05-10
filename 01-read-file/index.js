const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, 'text.txt');

const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });

readStream.on('data', (data) => {
  console.log(data);
});

readStream.on('error', (err) => {
  console.error(err);
});
