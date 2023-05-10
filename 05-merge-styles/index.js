const fs = require('fs').promises;
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const distDir = path.join(__dirname, 'project-dist');
const bundleFile = path.join(distDir, 'bundle.css');

fs.readdir(stylesDir)
  .then((files) => {
    // Оставляем только файлы с расширением .css
    const cssFiles = files.filter((file) => path.extname(file) === '.css');

    // Считываем содержимое каждого файла и объединяем в одну строку
    return Promise.all(
      cssFiles.map((file) => fs.readFile(path.join(stylesDir, file), 'utf8'))
    ).then((contents) => contents.join('\n'));
  })
  .then((cssContent) => {
    // Создаем папку dist, если она не существует
    return fs.mkdir(distDir, { recursive: true }).then(() => cssContent);
  })
  .then((cssContent) => {
    // Записываем строку в файл bundle.css
    return fs.writeFile(bundleFile, cssContent);
  })
  .then(() => {
    console.log(`Styles are merged into ${bundleFile}`);
  })
  .catch((err) => {
    console.error('Error merging styles:', err);
  });
