const fs = require('fs');

// Copy package.json
const packageRaw = fs.readFileSync('package.json', 'utf-8');
const packageJson = JSON.parse(packageRaw);
delete packageJson['scripts'];
delete packageJson['devDependencies'];
delete packageJson['files'];
delete packageJson['publishConfig'];
fs.writeFileSync('dist/package.json', JSON.stringify(packageJson));

// Copy .md files
fs.copyFileSync('README.md', './dist/README.md');
