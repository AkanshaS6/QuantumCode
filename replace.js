const fs = require('fs');
const path = require('path');

const srcDir = 'd:/QuantumCode/QuantumCode/FrontEnd/src';

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else {
            callback(dirPath);
        }
    });
}

walkDir(srcDir, (filePath) => {
    if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        if (content.includes("'http://localhost:3000")) {
            content = content.replace(/'http:\/\/localhost:3000([^']*)'/g, "`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}$1`");
            modified = true;
        }

        if (content.includes("`http://localhost:3000")) {
            content = content.replace(/`http:\/\/localhost:3000([^`]*)`/g, "`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}$1`");
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated: ${filePath}`);
        }
    }
});
console.log('DONE');
