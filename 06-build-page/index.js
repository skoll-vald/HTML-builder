const fs = require('fs').promises;
const path = require('path');
const glob = require('glob');

async function readFiles(dir) {
  const files = await fs.readdir(dir);
  return Promise.all(
    files.map(async (file) => {
      const filePath = path.join(dir, file);
      const content = await fs.readFile(filePath, 'utf8');
      console.log(`File: ${filePath}, Content: ${content}`);
      return { name: file.replace('.html', ''), content };
    })
  );
}

async function replaceTemplateTags(template, components) {
  for (const component of components) {
    const regex = new RegExp(`{{\\s*${component.name}\\s*}}`, 'g');
    template = template.replace(regex, component.content);
    console.log(`Matched tag: ${regex}, Content: ${component.content}`);
  }
  return template;
}

async function buildPage() {
  const componentsPath = path.join(__dirname, 'components');
  const stylesPath = path.join(__dirname, 'styles');
  const assetsPath = path.join(__dirname, 'assets');
  const templatePath = path.join(__dirname, 'template.html');
  const distPath = path.join(__dirname, 'project-dist');

  try {
    await fs.mkdir(distPath);
    console.log(`Created directory: ${distPath}`);
  } catch (error) {
    if (error.code !== 'EEXIST') {
      console.error(error);
      return;
    }
  }

  const template = await fs.readFile(templatePath, 'utf8');
  const [components, styles] = await Promise.all([readFiles(componentsPath), readFiles(stylesPath)]);
  const replacedContent = await replaceTemplateTags(template, components.flat());
  console.log(replacedContent);
  const indexFilePath = path.join(distPath, 'index.html');
  await fs.writeFile(indexFilePath, replacedContent);
  console.log(`Created file: ${indexFilePath}`);  
  const styleFilePath = path.join(distPath, 'style.css');
  const styleContent = styles.map((style) => style.content).join('\n');
  await fs.writeFile(styleFilePath, styleContent);
  console.log(`Created file: ${styleFilePath}`);

  const assetsDistPath = path.join(distPath, 'assets');
  try {
    await fs.mkdir(assetsDistPath);
    console.log(`Created directory: ${assetsDistPath}`);
  } catch (error) {
    if (error.code !== 'EEXIST') {
      console.error(error);
      return;
    }
  }

  const assetsFiles = glob.sync(`${assetsPath}/**/*`, { nodir: true });
  const copyPromises = assetsFiles.map(async (assetFile) => {
    const assetName = path.relative(assetsPath, assetFile);
    const assetDistPath = path.join(assetsDistPath, assetName);
    await fs.mkdir(path.dirname(assetDistPath), { recursive: true });
    await fs.copyFile(assetFile, assetDistPath);
    console.log(`Copied file: ${assetDistPath}`);
  });
  await Promise.all(copyPromises);
}

buildPage().then(() => console.log('Done!')).catch((error) => console.error(error));
