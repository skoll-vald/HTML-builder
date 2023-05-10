const fs = require('fs/promises');
const path = require('path');

const outputFilePath = path.join(__dirname, 'output.txt');

(async function() {
  try {
    // Create empty file if it does not exist
    try {
      await fs.access(outputFilePath);
    } catch {
      await fs.writeFile(outputFilePath, '');
      console.log(`Empty file created at ${outputFilePath}`);
    }

    const readline = require('readline');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.setPrompt('Enter text (type "exit" to quit): ');
    rl.prompt();

    rl.on('line', async (input) => {
      if (input === 'exit') {
        console.log('Goodbye!');
        process.exit(0);
      }

      try {
        await fs.appendFile(outputFilePath, input + '\n');
        console.log(`Text "${input}" has been saved to ${outputFilePath}`);
      } catch (err) {
        console.error(`Error writing to file: ${err}`);
      }

      rl.prompt();
    });

    rl.on('close', () => {
      console.log('Goodbye!');
      process.exit(0);
    });
  } catch (err) {
    console.error(`Error initializing application: ${err}`);
    process.exit(1);
  }
})();
