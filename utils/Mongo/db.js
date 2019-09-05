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

    _client = await MongoClient.connect(config.get('Customer.dbConfig').connectionString, config.get('Customer.dbConfig').connectionOptions);
    _db = _client.db("test");
    myLogger.info("DB initialized");


}

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