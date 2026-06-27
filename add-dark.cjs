const fs = require('fs');
const path = require('path');

const classMap = {
  'bg-white': 'dark:bg-slate-800',
  'bg-slate-50': 'dark:bg-slate-900',
  'bg-gray-50': 'dark:bg-gray-900',
  'text-slate-900': 'dark:text-white',
  'text-gray-900': 'dark:text-white',
  'text-slate-800': 'dark:text-slate-200',
  'text-gray-800': 'dark:text-gray-200',
  'text-slate-700': 'dark:text-slate-300',
  'text-gray-700': 'dark:text-gray-300',
  'text-slate-600': 'dark:text-slate-400',
  'text-gray-600': 'dark:text-gray-400',
  'text-slate-500': 'dark:text-slate-400',
  'text-gray-500': 'dark:text-gray-400',
  'border-slate-200': 'dark:border-slate-700',
  'border-gray-200': 'dark:border-gray-700',
  'border-slate-300': 'dark:border-slate-600',
  'border-gray-300': 'dark:border-gray-600',
  'divide-slate-200': 'dark:divide-slate-700',
  'divide-gray-200': 'dark:divide-gray-700',
  'hover:bg-slate-50': 'dark:hover:bg-slate-800',
  'hover:bg-gray-50': 'dark:hover:bg-gray-800',
  'hover:bg-slate-100': 'dark:hover:bg-slate-700',
  'hover:bg-gray-100': 'dark:hover:bg-gray-700',
  'bg-slate-100': 'dark:bg-slate-800',
  'bg-gray-100': 'dark:bg-gray-800'
};

function processFile(filePath) {
    if (filePath.endsWith('DarkModeToggle.jsx') || filePath.endsWith('ThemeContext.jsx')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;

    for (const [light, dark] of Object.entries(classMap)) {
        const escapedLight = light.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`(?<![\\w-:])${escapedLight}(?![\\w-])`, 'g');
        
        newContent = newContent.replace(regex, (match, offset, string) => {
            const nextPart = string.slice(offset + match.length, offset + match.length + dark.length + 10);
            if (nextPart.includes(dark)) {
                return match;
            }
            return `${match} ${dark}`;
        });
    }

    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated ${filePath}`);
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
console.log('Done.');
