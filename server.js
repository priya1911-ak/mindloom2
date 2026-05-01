const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8080;
const dir = __dirname;

const server = http.createServer((req, res) => {
    let filePath = path.join(dir, req.url === '/' ? 'index.html' : req.url);
    let extname = path.extname(filePath);
    let contentType = 'text/html';
    switch (extname) {
        case '.js': contentType = 'text/javascript'; break;
        case '.css': contentType = 'text/css'; break;
        case '.svg': contentType = 'image/svg+xml'; break;
        case '.png': contentType = 'image/png'; break;
    }
    fs.readFile(filePath, (err, content) => {
        if (err) { 
            res.writeHead(404); 
            res.end('Not found'); 
        } else { 
            res.writeHead(200, { 'Content-Type': contentType }); 
            res.end(content, 'utf-8'); 
        }
    });
});

server.listen(port, () => {
    console.log(`Local dev server running at http://localhost:${port}/`);
});
