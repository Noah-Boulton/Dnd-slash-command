const express = require('express');
const app = express();
const routes = require('./routes');
const bodyParser = require('body-parser');
var Datastore = require('nedb');
const dotenv = require('dotenv').config();

/*
 * Parse application/x-www-form-urlencoded && application/json
 * Use body-parser's `verify` callback to export a parsed raw body
 * that you need to use to verify the signature
 */

const rawBodyBuffer = (req, res, buf, encoding) => {
    if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
    }
};

const database = new Datastore({ filename: 'database.db', autoload: true });
database.persistence.setAutocompactionInterval(420000);

app.use(bodyParser.urlencoded({ verify: rawBodyBuffer, extended: true }));
app.use(bodyParser.json({ verify: rawBodyBuffer }));

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), () => {
    console.log('Server listening on port %s', app.get('port'))
});

app.post('/cast', function (req, res) {
    routes.cast(req, res);
})

app.post('/feat', function (req, res) {
    routes.feat(req, res);
})

app.post('/condition', function (req, res) {
    routes.condition(req, res);
})

app.post('/gold', function (req, res) {
    routes.gold(req, res, database);
})
