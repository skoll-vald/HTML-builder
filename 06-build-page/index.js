const fs = require('fs');
const path = require('path');

// create project-dist directory if it doesn't exist
const distDir = path.join(__dirname, 'project-dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// read the template file
const templateFile = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf-8');

// read the components directory and get the contents of each file
const componentsDir = path.join(__dirname, 'components');
const componentFiles = fs.readdirSync(componentsDir);
const components = {};
componentFiles.forEach((file) => {
  const filePath = path.join(componentsDir, file);
  const stats = fs.statSync(filePath);
  if (stats.isFile() && path.extname(file) === '.html') {
    const componentName = path.basename(file, '.html');
    components[componentName] = fs.readFileSync(filePath, 'utf-8');
  }
});

// replace the template tags with the contents of the corresponding components
let indexHtml = templateFile;
Object.keys(components).forEach((componentName) => {
  const tag = `{{${componentName}}}`;
  const componentContent = components[componentName];
  indexHtml = indexHtml.replace(tag, componentContent);
});

// write the index.html file
const indexHtmlPath = path.join(distDir, 'index.html');
fs.writeFileSync(indexHtmlPath, indexHtml);

// concatenate the styles and write to style.css
const stylesDir = path.join(__dirname, 'styles');
const styleFiles = fs.readdirSync(stylesDir);
let styleCss = '';
styleFiles.forEach((file) => {
  const filePath = path.join(stylesDir, file);
  const stats = fs.statSync(filePath);
  if (stats.isFile() && path.extname(file) === '.css') {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    styleCss += fileContent;
  }
});
const styleCssPath = path.join(distDir, 'style.css');
fs.writeFileSync(styleCssPath, styleCss);

// copy the assets directory to project-dist/assets
const assetsDir = path.join(__dirname, 'assets');
const distAssetsDir = path.join(distDir, 'assets');

if (!fs.existsSync(distAssetsDir)) {
  fs.mkdirSync(distAssetsDir);
}

const assetFiles = fs.readdirSync(assetsDir);

assetFiles.forEach((file) => {
  const srcPath = path.join(assetsDir, file);
  const destPath = path.join(distAssetsDir, file);
  const stats = fs.statSync(srcPath);

  if (stats.isFile()) {
    fs.copyFileSync(srcPath, destPath);
  } else if (stats.isDirectory()) {
    fs.mkdirSync(destPath, { recursive: true });
    copyFolderRecursiveSync(srcPath, destPath);
  }
});

function copyFolderRecursiveSync(src, dest) {
  fs.readdirSync(src).forEach((file) => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const stats = fs.statSync(srcPath);

    if (stats.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    } else if (stats.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyFolderRecursiveSync(srcPath, destPath);
    }
  });
}

