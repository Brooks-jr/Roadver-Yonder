
var StaticServer = require('static-server');
var server = new StaticServer({
    rootPath: './public/',
    name: 'decepticon-server',
    port: 3000
});

server.start(function () {
    console.log('server started on port ' + server.port)
})