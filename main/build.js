const fs = require('fs');
const path = require('path');
const minify = require('html-minifier').minify;
const cssMinify = require('clean-css').minify;
const UglifyJS = require('uglify-js');

function combineFiles(fileType) {
    const files = fs.readdirSync(__dirname).filter(file => path.extname(file) === `.${fileType}`);
    let combinedContent = '';
    files.forEach(file => {
        combinedContent += fs.readFileSync(path.join(__dirname, file), 'utf8');
    });
    return combinedContent;
}

function minifyCss(cssContent) {
    return cssMinify(cssContent).styles;
}

function minifyJs(jsContent) {
    return UglifyJS.minify(jsContent).code;
}

function writeToHtml(htmlContent) {
    const minifiedHtml = minify(htmlContent, {
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
    });
    fs.writeFileSync('index.html', minifiedHtml);
}

// Combine and minify CSS files
const combinedCss = combineFiles('css');
const minifiedCss = minifyCss(combinedCss);

// Combine and minify JavaScript files
const combinedJs = combineFiles('js');
const minifiedJs = minifyJs(combinedJs);

// Combine HTML files (optional)
const combinedHtml = combineFiles('html');

// Modify HTML to include combined CSS and JavaScript
const htmlWithLinks = combinedHtml.replace('</head>', 
    `<style>${minifiedCss}</style></head>`)
    .replace('</body>', `<script>${minifiedJs}</script></body>`);

// Write to HTML file
writeToHtml(htmlWithLinks);
