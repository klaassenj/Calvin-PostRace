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

var sync = false;
var addID = false;
var clearNoID = false;
var databaseToClearNoIDs = "backup-races"
var addDate = false;
var clearNoDate = false;
var recoverFromBackup = false;
var clearDuplicate = false;
//Connect to Mongo Database
mclient.connect(`mongodb://${username}:${password}@${host}:${port}/${database}`, function (err, client) {
    if (err) {
        console.warn(err)
        console.warn("Continuing Deployment without Database Access...")
    } else {    
        postraceDB = client.db(database);
        console.log("Connected Successfully to MongoDB.")
        if(sync) synchronizeBackup();
        if(addID) writeNewIDs();
        if(clearNoID) clearNoIDs(databaseToClearNoIDs);
        if(addDate) addDates();
        if(clearNoDate) clearNoDates("races");
        if(recoverFromBackup) addFromBackup();
        if(clearDuplicate) clearDuplicates("races");
    }
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
        var duplicates = array.filter(item => item.ID == req.body.ID);
        if(duplicates.length > 0) {

            postraceDB.collection('races').update(duplicates[0], req.body);
            res.statusCode = 200;
            res.send({result: "Successful Update", body: req.body, dup: duplicates});    
        } else {
            postraceDB.collection('races').insert(req.body);
            res.statusCode = 200;
            res.send({result: "Successful Insert", body: req.body, dup: duplicates});    
        } 
    });
});

// DELETE - /api/races
app.delete('/api/races', function(req, res, next) {
    try {
        postraceDB.collection('races').delete(req.body);
    } catch(e) {
        console.warn(e);
    }
});

// POST - /api/bugs
app.post('/api/bugs', function(req, res, next) {
    postraceDB.collection('bugs').find({}).toArray((err, array) => {
        var duplicates = array.filter(item => item.name == req.body.name && item.bugdesc == req.body.bugdesc);
        if(duplicates.length > 0) {
            postraceDB.collection('bugs').update(req.body);
            res.statusCode = 200;
            res.send({result: "Successful Update", body: req.body, dup: duplicates});    
        } else {
            postraceDB.collection('bugs').insert(req.body);
            res.statusCode = 200;
            res.send({result: "Successful Insert", body: req.body, dup: duplicates});    
        }
    });
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

function synchronizeBackup() {
    postraceDB.collection("races").find({}).toArray((err, array) => {
        if(err) {
            console.warn("Backup Failed...")
            console.warn(err);
        } else {
            array.forEach(doc => {
                var backupFile = doc;
                delete backupFile._id;
                postraceDB.collection("backup-races").update({ID: doc.ID}, backupFile, {upsert: true});
            });
            console.log("Backup completed successfully.")
        }
    });
};

function addFromBackup() {
    postraceDB.collection("backup-races").find({}).toArray((err, array) => {
        if(err) {
            console.warn("Recovery Failed...")
            console.warn(err);
        } else {
            array.forEach(doc => {
                var backupFile = doc;
                delete backupFile._id;
                postraceDB.collection("races").update({ID: doc.ID}, backupFile, {upsert: true});
            });
            console.log("Recovery completed successfully.")
        }
    });
}

function writeNewIDs() {
    postraceDB.collection("races").find({}).toArray((err, array) => {
        if(err) {
            console.warn("writing new IDs Failed...")
            console.warn(err);
        } else {
            array.forEach(doc => {
                console.log("Updating Doc " + doc.name + " " + doc.meet)
                if(doc.ID == undefined) {
                    var addID = doc;
                    delete addID._id;
                    addID.ID = doc.name + doc.meet
                    console.log("New Doc");
                    console.log(addID.ID + "\n" + addID.name + "\n" + addID.meet)
                    postraceDB.collection("races").update(doc, addID, {upsert: true})
                }
            })
            console.log("Writing New IDs Successful.")
        }
    });
}

function addDates() {
    postraceDB.collection("races").find({}).toArray((err, array) => {
        if(err) {
            console.warn("Add Date failed")
            console.warn(err);
        } else {
            array.forEach(doc => {
                if(doc.date == undefined) {
                    var newDoc = doc;
                    delete newDoc._id;
                    newDoc.date = Date.now();
                    console.log("Adding Date to " + doc.name + " " + doc.meet)
                    postraceDB.collection("races").update({ID: doc.ID}, newDoc);
                }
            });
            console.log("Date Adding Sucessful.");
        }
    });
}

function clearNoIDs(database) {
    postraceDB.collection(database).find({}).toArray((err, array) => {
        if(err) {
            console.warn("Clear Failed...")
            console.warn(err);
        } else {
            array.forEach(doc => {
                console.log("New Doc");
                console.log(doc.ID + "\n" + doc.name + "\n" + doc.meet)
                if(doc.ID == undefined) {
                    console.log("Deleting " + doc.name + " " + doc.meet)
                    postraceDB.collection(database).remove(doc)
                } else {
                    console.log("No Action Needed.")
                }
            })
            console.log("Clear Successful.")
        }
    });
}

function clearNoDates(database) {
    postraceDB.collection(database).find({}).toArray((err, array) => {
        if(err) {
            console.warn("Clear Failed...")
            console.warn(err);
        } else {
            array.forEach(doc => {
                console.log("New Doc");
                console.log(doc.date + "\n" + doc.name + "\n" + doc.meet)
                if(doc.date == undefined) {
                    console.log("Deleting " + doc.name + " " + doc.meet)
                    postraceDB.collection(database).remove(doc)
                } else {
                    console.log("No Action Needed.")
                }
            })
            console.log("Clear Successful.")
        }
    });
}

function clearDuplicates(database) {
    postraceDB.collection(database).find({}).toArray((err, array) => {
        if(err) {
            console.warn("Duplicate Clear Failed...")
            console.warn(err);
        } else {
            var duplicates = [];
            array.forEach(doc => {
                console.log("New Doc");
                console.log(doc.date + "\n" + doc.name + "\n" + doc.meet)
                if(duplicates.includes(doc.ID)) {
                    console.log("Deleting Copy of" + doc.name + " " + doc.meet)
                    postraceDB.collection(database).remove(doc)
                } else {
                    duplicates.push(doc.ID);
                    console.log("No Action Needed.")
                }
            })
            console.log("Duplicate Clear Successful.")
        }
    });
}