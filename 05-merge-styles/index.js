const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const distDir = path.join(__dirname, 'project-dist');
const bundleFile = path.join(distDir, 'bundle.css');

// Получаем список файлов в директории styles
fs.readdir(stylesDir, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  // Оставляем только файлы с расширением .css
  const cssFiles = files.filter((file) => path.extname(file) === '.css');

  // Считываем содержимое каждого файла и объединяем в одну строку
  const cssContent = cssFiles
    .map((file) => fs.readFileSync(path.join(stylesDir, file), 'utf8'))
    .join('\n');

  // Создаем папку dist, если она не существует
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
  }

  // Записываем строку в файл bundle.css
  fs.writeFileSync(bundleFile, cssContent);

  console.log(`Styles are merged into ${bundleFile}`);
});
