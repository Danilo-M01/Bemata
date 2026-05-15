const fs = require('fs');

function bustCache(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Find all /images/something.ext and add ?v=2
    content = content.replace(/\/images\/([^\"'\)]+?\.(webp|png|jpg))(?![\?v])/g, '/images/$1?v=2');
    fs.writeFileSync(filePath, content);
}

bustCache('web/public/index.html');
bustCache('web/public/style.css');
console.log('Cache busting applied.');
