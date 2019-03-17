/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.





 */

//Load Libraries
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
// MongoDB variables
var username = 'admin'
var password = process.env.MONGO_PASSWORD
var host = 'ds141815.mlab.com'
var port = '41815'
var database = 'calvinpostrace'
var postraceDB = null;
var mclient = require('mongodb').MongoClient

//Connect to Mongo Database
mclient.connect(`mongodb://${username}:${password}@${host}:${port}/${database}`, function (err, client) {
    if (err) throw err
    postraceDB = client.db(database);
    console.log("Connected Successfully to MongoDB.")
});

// Set up Body Parser
var db;
var APP_PATH = path.join(__dirname, 'dist');
app.set('port', (process.env.PORT || 3000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//Create Endpoints

// GET - /api/usernames/
app.get('/api/races', function(req, res) {
    var usernamesList = postraceDB.collection('races').find({}).toArray((err, result) => {
        if(err) throw err;
        res.json(result);
    });
});

// POST - /api/races/
app.post('/api/races', function(req, res, next) {
    postraceDB.collection('races').find({}).toArray((err, array) => {
        var duplicates = array.filter(item => item.name == req.body.name && item.meet == req.body.meet);
        if(duplicates) {
            postraceDB.collection('races').update(req.body);
            res.statusCode = 200;
            res.send({result: "Successful Update", body: req.body, dup: duplicates});    
        } else {
            postraceDB.collection('races').insert(req.body);
            res.statusCode = 200;
            res.send({result: "Successful Insert", body: req.body, dup: duplicates});    
        }
        
        
    });
    
});
app.put('/api/races', function(req, res, next) {
    postraceDB.collection('races').update(req.body);
    res.statusCode = 200;
    res.send({result: "Success"});
});


// Add Headers to responses
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

// Catch other routes
app.use('/', express.static(APP_PATH));
app.use('*', express.static(APP_PATH));

// Launch Server
app.listen(app.get('port'), function() {
        console.log('Server started: http://localhost:' + app.get('port') + '/');
});
