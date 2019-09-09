const myLogger = require('./utils/log/logger')(__filename);
const _ = require('underscore');
const _db = require("./utils/Mongo/db");
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const multer = require('multer');

fs = require('fs-extra');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public/Sites'));

ObjectId = require('mongodb').ObjectId;

// upload helper
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    }
});

let upload = multer({storage: storage});

_db.initDb().then(async function () {
    app.listen(3000, () => {
        myLogger.info('listening on 3000');
    })
}).catch(function () {
    myLogger.error("Error in init db");
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// upload single file

app.post('/upload_file', upload.single('myFile'), (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error);

    }
    res.send(file);
});

//Uploading multiple files
app.post('/upload_multiple', upload.array('myFiles', 12), (req, res, next) => {
    const files = req.files;
    if (!files) {
        const error = new Error('Please choose files');
        error.httpStatusCode = 400;
        return next(error);
    }
    res.send(files);
});

// save to  mongodb
app.post('/upload_photo', upload.single('picture'), (req, res) => {
    let img = fs.readFileSync(req.file.path);
    let encode_image = img.toString('base64');
    // Define a JSON_Object for the image attributes for saving to database

    let finalImg = {
        contentType: req.file.mimetype,
        image: new Buffer(encode_image, 'base64')
    };
    _db.getDb().collection('mycollection').insertOne(finalImg, (err, result) => {
        myLogger.info(result.result.ok);

        if (err) return myLogger.error(err);

        myLogger.info('saved to database');
        res.redirect('/');

    });
});


app.get('/photos', (req, res) => {
    _db.getDb().collection('mycollection').find().toArray((err, result) => {

        const imgArray = result.map(element => element._id);
        let translated = _.map(imgArray).join(',\n');
        myLogger.info(`result:\n${translated}`);
        if (err) return myLogger.error(err);
        res.send(imgArray);
    });
});

app.get('/photo/:id', (req, res) => {
    let filename = req.params.id;
    _db.getDb().collection('mycollection').findOne({'_id': ObjectId(filename)}, (err, result) => {
        if (err) return myLogger.error(err);

        res.contentType('image/jpeg');
        res.send(result.image.buffer);

    });
});


