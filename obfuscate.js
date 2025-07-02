const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const buildPath = path.join(__dirname, 'build', 'static', 'js');

fs.readdirSync(buildPath).forEach(file => {
  if (file.endsWith('.js')) {
    const filePath = path.join(buildPath, file);
    const code = fs.readFileSync(filePath, 'utf8');

    const obfuscated = JavaScriptObfuscator.obfuscate(code, {
      compact: true,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 0.75,
      numbersToExpressions: true,
      simplify: true,
      stringArrayShuffle: true,
      splitStrings: true,
      stringArrayThreshold: 0.75
    }).getObfuscatedCode();

    fs.writeFileSync(filePath, obfuscated, 'utf8');
    console.log(`✔ Ofuscado: ${file}`);
  }
});
