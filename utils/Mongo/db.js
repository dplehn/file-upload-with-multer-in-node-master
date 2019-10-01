const MongoClient = require("mongodb").MongoClient;
const config = require("config");
const myLogger = require('../log/logger')(__filename);

let _db;
let _client;


async function initDb() {
    if (_db) {
        myLogger.error("Trying to init DB again!");
        return;
    }
    _client = await MongoClient.connect(config.get('Customer.dbConfig').connStr, config.get('Customer.dbConfig').connOpt)
        .catch(err => {
            console.log(err);
            myLogger.error(err);
            throw new Error("Error in initDb()");
        });

    try {
        _db = _client.db("test");
    } catch (err) {
        console.log(err);
    }
    console.log("end initDb");
}


// MongoClient.connect(config.get('Customer.dbConfig').connStr, config.get('Customer.dbConfig').connOpt).then((_client) => {
//     console.log("connect");
//     _db = _client.db("test");
//     console.log("vor true");
//     return 1;
//
// }).catch((error) => {
//     console.log(error);
//     return 0;
//process.exit(0);

//});
// console.log("aaaaa");
// }


/*
_client = await MongoClient.connect(config.get('Customer.dbConfig').connectionString, config.get('Customer.dbConfig').connectionOptions);
_db = _client.db("test");

 */


function getDb() {
    if (_db === null) {
        myLogger.error("Db has not been initialized. Please called init first.");
    }
    return _db;
}

async function closeDb() {
    await _client.close();
    //process.exit(0);
}

module.exports = {
    getDb,
    initDb,
    closeDb
};