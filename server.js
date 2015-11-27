/*globals require,console*/
var fs = require('fs'),
    http = require('http'),
    path = require('path'),
    PORT = 62026,
    http_server,
    base_path = '.',
    extension,
    content_type;

function handle_request(request, response) {
    var extension = path.extname(request.url),
        file_path = base_path + request.url,
        content_type = 'text/html';

    switch (extension) {
        case '.js':
            content_type = 'text/javascript';
            break;
        case '.css':
            content_type = 'text/css';
            break;
        case '.json':
            content_type = 'application/json';
            break;
        case '.png':
            content_type = 'image/png';
            break;
        case '.jpg':
            content_type = 'image/jpg';
            break;
        case '.wav':
            content_type = 'audio/wav';
            break;
    }

    fs.readFile(file_path, function (error, content) {
        if (error) {
            if (error.code === 'ENOENT') {
                response.writeHead(404);
                response.end('Not found');
                response.end();
            } else {
                response.writeHead(500);
                response.end('Error');
                response.end();
            }
        } else {
            response.writeHead(200, {'Content-Type': content_type});
            response.end(content, 'utf-8');
        }
    });
}

http_server = http.createServer(handle_request);

http_server.listen(PORT, function () {
    console.log('Server listening on: http://localhost:%s', PORT);
});
