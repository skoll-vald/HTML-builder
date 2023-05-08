const fs = require('fs');
const path = require('path');

const outputFilePath = path.join(__dirname, 'output.txt');

// Create empty file if it does not exist
if (!fs.existsSync(outputFilePath)) {
  fs.writeFileSync(outputFilePath, '');
  console.log(`Empty file created at ${outputFilePath}`);
}

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.setPrompt('Enter text (type "exit" to quit): ');
rl.prompt();

rl.on('line', (input) => {
  if (input === 'exit') {
    console.log('Goodbye!');
    process.exit(0);
  }

  fs.appendFile(outputFilePath, input + '\n', (err) => {
    if (err) throw err;
    console.log(`Text "${input}" has been saved to ${outputFilePath}`);
    rl.prompt();
  });
});

rl.on('close', () => {
  console.log('Goodbye!');
  process.exit(0);
});
