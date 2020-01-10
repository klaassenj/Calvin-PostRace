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

// Maintenance Flags
var sync = false;
var recoverFromBackup = false;
var dumpBackupToFile = false;
var archive = false;


//Connect to Mongo Database
mclient.connect(`mongodb://${username}:${password}@${host}:${port}/${database}`, function (err, client) {
    if (err) {
        console.warn(err)
        console.warn("Continuing Deployment without Database Access...")
    } else {
        postraceDB = client.db(database);
        console.log("Connected Successfully to MongoDB.")
        if (sync) synchronizeBackup();
        if (archive) archiveRaces("XC 2019");
        if (recoverFromBackup) addFromBackup();
        if (dumpBackupToFile) displayCollection("races");
    }
});

// Set up Body Parser
var db;
var APP_PATH = path.join(__dirname, 'dist');
app.set('port', (process.env.PORT || 3000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Create Endpoints

// GET - /api/races/
app.get('/api/races', function (req, res) {
    var usernamesList = postraceDB.collection('races').find({}).toArray((err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// GET - /api/archives
app.get('/api/archives', function (req, res) {
    var usernamesList = postraceDB.collection('archives').find({}).toArray((err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// GET - /api/records
app.get('/api/records', function (req, res) {
    postraceDB.collection('records').find({}).toArray((err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// POST - /api/races/
app.post('/api/races', function (req, res, next) {
    postraceDB.collection('races').find({}).toArray((err, array) => {
        var duplicates = array.filter(item => item.ID == req.body.ID);
        if (duplicates.length > 0) {

            postraceDB.collection('races').update(duplicates[0], req.body);
            res.statusCode = 200;
            res.send({ result: "Successful Update", body: req.body, dup: duplicates });
        } else {
            postraceDB.collection('races').insert(req.body);
            res.statusCode = 200;
            res.send({ result: "Successful Insert", body: req.body, dup: duplicates });
        }
    });
});

// // DELETE - /api/races
// app.delete('/api/races', function (req, res, next) {
//     try {
//         postraceDB.collection('races').delete(req.body);
//     } catch (e) {
//         console.warn(e);
//     }
// });

// POST - /api/bugs
app.post('/api/bugs', function (req, res, next) {
    postraceDB.collection('bugs').find({}).toArray((err, array) => {
        var duplicates = array.filter(item => item.name == req.body.name && item.bugdesc == req.body.bugdesc);
        if (duplicates.length > 0) {
            postraceDB.collection('bugs').update(req.body);
            res.statusCode = 200;
            res.send({ result: "Successful Update", body: req.body, dup: duplicates });
        } else {
            postraceDB.collection('bugs').insert(req.body);
            res.statusCode = 200;
            res.send({ result: "Successful Insert", body: req.body, dup: duplicates });
        }
    });
});

app.post('/api/records', function (req, res, next) {
    postraceDB.collection('records').find({}).toArray((err, array) => {
        var duplicates = array.filter(item => item.name == req.body.name);
        if (duplicates.length > 0) {
            postraceDB.collection('records').update(req.body);
            res.statusCode = 200;
            res.send({ result: "Successful Update", body: req.body, dup: duplicates });
        } else {
            postraceDB.collection('records').insert(req.body);
            res.statusCode = 200;
            res.send({ result: "Successful Insert", body: req.body, dup: duplicates });
        }
    });
});


// Add Headers to responses
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

// Catch other routes
app.use('/', express.static(APP_PATH));
app.use('*', express.static(APP_PATH));

// Launch Server
app.listen(app.get('port'), function () {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});

/////////////////////////////////
/////////////////////////////////
// Server Maintence Operations //
/////////////////////////////////
/////////////////////////////////

function synchronizeBackup() {
    postraceDB.collection("races").find({}).toArray((err, array) => {
        if (err) {
            console.warn("Backup Failed...")
            console.warn(err);
        } else {
            array.forEach(doc => {
                var backupFile = doc;
                delete backupFile._id;
                postraceDB.collection("backup-races").update({ ID: doc.ID }, backupFile, { upsert: true });
            });
            console.log("Backup completed successfully.")
        }
    });
};

function setSeason(seasonName) {
    postraceDB.collection("races").find({}).toArray((err, array) => {
        if (err) {
            console.warn("Recovery Failed...")
            console.warn(err);
        } else {
            array.forEach(doc => {
                var file = doc;
                delete file._id;
                file.season = seasonName;
                postraceDB.collection("races").update({ ID: doc.ID }, file, { upsert: true });
            });
            console.log("Season set completed successfully.")
        }
    });
}

function addFromBackup() {
    postraceDB.collection("backup-races").find({}).toArray((err, array) => {
        if (err) {
            console.warn("Recovery Failed...")
            console.warn(err);
        } else {
            array.forEach(doc => {
                var backupFile = doc;
                delete backupFile._id;
                postraceDB.collection("races").update({ ID: doc.ID }, backupFile, { upsert: true });
            });
            console.log("Recovery completed successfully.")
        }
    });
}

function archiveRaces(season) {
    setSeason(season);
    postraceDB.collection("races").find({}).toArray((err, array) => {
        if (err) {
            console.warn("Archive Failed...")
            console.warn(err);
        } else {
            array.forEach(doc => {
                
                postraceDB.collection("archives").update({ ID: doc.ID }, doc, { upsert: true });
            });
            console.log("Archive completed successfully.")
            
        }
    });
    postraceDB.collection("races").deleteMany({});
}

function displayCollection(table) {
    postraceDB.collection(table).find({}).toArray((err, array) => {
        if(err) {
            console.warn("Display Failed...")
            console.warn(err);
        } else {
            array.forEach(doc => {

                delete doc._id;
            })
            require('fs').writeFile("./dump.json", JSON.stringify(array), (err) => {
                if (err) {
                    console.error(err);
                    return;
                };
                console.log("File has been created");
            });
            console.log("Dump completed successfully.")
        }
    });
}

function findLatestSubmitDate() {
    postraceDB.collection("races").find({}).toArray((err, array) => {
        if(err) {
            console.warn("Display Failed...")
            console.warn(err);
        } else {
            var latestSubmit = 0;
            array.forEach(doc => {
                if(doc.date > latestSubmit) {
                    latestSubmit = doc.date
                }
            });
            console.log("The latest submit date is " + latestSubmit);
        }
    });
}