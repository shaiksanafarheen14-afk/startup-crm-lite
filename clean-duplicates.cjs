const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    if (filePath.endsWith('DarkModeToggle.jsx') || filePath.endsWith('ThemeContext.jsx')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace duplicate dark:bg-slate-XXX dark:bg-slate-YYY
    let newContent = content.replace(/(dark:bg-(?:slate|gray)-\d{3})\s+(dark:bg-(?:slate|gray)-\d{3})/g, '$2');
    newContent = newContent.replace(/(dark:text-(?:slate|gray)-\d{3})\s+(dark:text-white)/g, '$2');
    newContent = newContent.replace(/(dark:text-(?:slate|gray)-\d{3})\s+(dark:text-(?:slate|gray)-\d{3})/g, '$2');
    newContent = newContent.replace(/(dark:hover:bg-(?:slate|gray)-\d{3})\s+(dark:hover:bg-(?:slate|gray)-\d{3})/g, '$2');

    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Cleaned ${filePath}`);
    }
}

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.jsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src'));
files.forEach(processFile);
console.log('Clean done.');
