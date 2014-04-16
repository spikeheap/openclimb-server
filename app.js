
/**
 * Module dependencies.
 */

var express = require('express');

// Routes
var routes = require('./routes');
var user = require('./routes/user');
var climbs = require('./routes/climbs');

var http = require('http');
var path = require('path');

var app = express();

// all environments

// Allow crossdomain requests (LOCAL ONLY)
// FIXME remove this and roll in with server
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9001');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/**
 * Routes
 **/
app.get('/', routes.index);
app.get('/users', user.list);

app.get('/api/climbs', climbs.list);
app.post('/api/climbs', climbs.create);

app.get('/api/climbs/:id', climbs.get);
app.put('/api/climbs/:id', climbs.save);
app.delete('/api/climbs/:id', climbs.delete);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
