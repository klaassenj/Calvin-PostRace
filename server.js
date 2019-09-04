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
var addID = false;
var clearNoID = false;
var addDate = false;
var clearNoDate = false;
var recoverFromBackup = false;
var clearDuplicate = false;
var dumpBackupToFile = false;
var clearCurrent = false;
var seasonComplete = false;
var seasonEnd = false;
var writeSeason = false;


//Connect to Mongo Database
mclient.connect(`mongodb://${username}:${password}@${host}:${port}/${database}`, function (err, client) {
    if (err) {
        console.warn(err)
        console.warn("Continuing Deployment without Database Access...")
    } else {
        postraceDB = client.db(database);
        console.log("Connected Successfully to MongoDB.")
        if (sync) synchronizeBackup();
        if(seasonComplete) archiveRaces("Summer 2019");
        if (addID) writeNewIDs();
        if (clearNoID) clearNoIDs("backup-races");
        if (addDate) addDates();
        if (clearNoDate) clearNoDates("races");
        if (recoverFromBackup) addFromBackup();
        if (clearDuplicate) clearDuplicates("races");
        if(dumpBackupToFile) displayCollection("backup-races");
        if(clearCurrent) clearCurrentRaces();
        if(seasonEnd) sortAndClearRaces("Outdoor 2019");
        if(writeSeason) setSeason("XC 2019")
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

function writeNewIDs() {
    postraceDB.collection("races").find({}).toArray((err, array) => {
        if (err) {
            console.warn("writing new IDs Failed...")
            console.warn(err);
        } else {
            array.forEach(doc => {
                console.log("Updating Doc " + doc.name + " " + doc.meet)
                if (doc.ID == undefined) {
                    var addID = doc;
                    delete addID._id;
                    addID.ID = doc.name + doc.meet
                    console.log("New Doc");
                    console.log(addID.ID + "\n" + addID.name + "\n" + addID.meet)
                    postraceDB.collection("races").update(doc, addID, { upsert: true })
                }
            })
            console.log("Writing New IDs Successful.")
        }
    });
}

function addDates() {
    postraceDB.collection("races").find({}).toArray((err, array) => {
        if (err) {
            console.warn("Add Date failed")
            console.warn(err);
        } else {
            array.forEach(doc => {
                if (doc.date == undefined) {
                    var newDoc = doc;
                    delete newDoc._id;
                    newDoc.date = Date.now();
                    console.log("Adding Date to " + doc.name + " " + doc.meet)
                    postraceDB.collection("races").update({ ID: doc.ID }, newDoc);
                }
            });
            console.log("Date Adding Sucessful.");
        }
    });
}

function clearNoIDs(database) {
    postraceDB.collection(database).find({}).toArray((err, array) => {
        if (err) {
            console.warn("Clear Failed...")
            console.warn(err);
        } else {
            array.forEach(doc => {
                console.log("New Doc");
                console.log(doc.ID + "\n" + doc.name + "\n" + doc.meet)
                if (doc.ID == undefined) {
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
        if (err) {
            console.warn("Clear Failed...")
            console.warn(err);
        } else {
            array.forEach(doc => {
                console.log("New Doc");
                console.log(doc.date + "\n" + doc.name + "\n" + doc.meet)
                if (doc.date == undefined) {
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
        if (err) {
            console.warn("Duplicate Clear Failed...")
            console.warn(err);
        } else {
            var duplicates = [];
            array.forEach(doc => {
                console.log("New Doc");
                console.log(doc.date + "\n" + doc.name + "\n" + doc.meet)
                if (duplicates.includes(doc.ID)) {
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

function archiveRaces(season) {
    postraceDB.collection("races").find({}).toArray((err, array) => {
        if (err) {
            console.warn("Archive Failed...")
            console.warn(err);
        } else {
            array.forEach(doc => {
                if(doc.event != "8k") {
                    postraceDB.collection("races").remove(doc);
                }
                
            });
            console.log("Archive completed successfully.")
            
        }
    });
}

function clearCurrentRaces() {
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

function sortAndClearRaces() {
    var promise = new Promise(resolve => setTimeout(resolve, 10))
    promise.then(() => {
        console.log("Get Latest Cutoff Date...");
        findLatestSubmitDate();
    }).then(() => {
        console.log("Starting Backup...")
        synchronizeBackup();
    }).then(() => {
        console.log("Archiving Races...")
        //archiveRaces("Outdoor 2019")
    }).then(() => { 
        console.log("Cleaning Current Races")
        postraceDB.collection("races").remove({});
    }).then(() => {
        console.log("Sort and Clear Complete")
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