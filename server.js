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
    var usernamesList = tictactoeDB.collection('races').find({}).toArray((err, result) => {
        if(err) throw err;
        res.json(result);
    });
});

// GET - /api/challenges/
app.get('/api/challenges', function(req, res) {
    console.log("GET")
    console.log(req.query)
    tictactoeDB.collection('challenges').find({opponent: req.query.username}).toArray((err, result) => {
        if (err) throw err
        if(result === undefined || result.length == 0) {
            res.statusCode = 201;
            res.send({result: "No Challenges"});
        } else {
            res.send({result: result[0]});
        }
    });
});

// GET - /api/archivedUsers/
app.get('/api/archivedUsers', function(req, res) {
    tictactoeDB.collection('archivedUsers').find().toArray((err, result) => {
        if (err) throw err
        if(result === undefined || result.length == 0) {
            res.statusCode = 201;
            res.send({result: "No Users"});
        } else {
            res.send({result: result});
        }
    });
});

//GET - /api/moves
app.get('/api/moves', function(req, res) {
    tictactoeDB.collection('moves').find(
      {$or: [
        {$and: [
          {username: req.query.username}, {opponent: req.query.opponent}
        ]},
        {$and: [
          {username: req.query.opponent}, {opponent: req.query.username}
        ]}
      ]}).toArray((err, result) => {
        if(err) throw err
        res.json(result);
    });
});

// POST - /api/usernames/
app.post('/api/races', function(req, res, next) {
    tictactoeDB.collection('usernames').insert({
        username: req.body.username,
    });
    res.statusCode = 200;
    res.send({result: "Success"});
});

// POST - /api/challenges/
app.post('/api/challenges', function(req, res) {
    tictactoeDB.collection('challenges').find({username: req.body.username}).toArray((err, result) => {
        if (err) throw err
        if(result === undefined || result.length == 0) {
            tictactoeDB.collection('challenges').insert(req.body);
            res.send({result: "Challenge Issued."    });
        } else {
            res.statusCode = 201;
            res.send({result: "Challenge Already Sent..."});
        }
    });

});

// PUT - /api/archivedUsers/
app.put('/api/archivedUsers', function(req, res) {
    tictactoeDB.collection('archivedUsers').update({username: req.body.username}, req.body, {upsert: true});
});

// POST - /api/moves/
app.post('/api/moves', function(req, res) {
    console.log("POST Moves");
    console.log(req.body);
    tictactoeDB.collection('moves').insert(req.body);
})

// DELETE - /api/usernames/
app.delete('/api/usernames', function(req, res) {
    var username = (req.body.username);
    try {
        tictactoeDB.collection('usernames').remove(req.body);
    } catch(e) {
        console.log(e);
    }
})

// DELETE - /api/challenges/
app.delete('/api/challenges', function(req, res) {
    try {
        tictactoeDB.collection('challenges').remove({username: req.body.username});
        tictactoeDB.collection('challenges').remove({opponent: req.body.username});
    } catch(e) {
        console.log(e);
    }
});

app.delete('/api/moves', function(req,res) {
    try {
        tictactoeDB.collection('moves').remove({username: req.body.username});
        tictactoeDB.collection('moves').remove({opponent: req.body.username});
    } catch(e) {
        console.log(e);
    }
})


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
