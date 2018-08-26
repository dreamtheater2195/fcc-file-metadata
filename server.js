'use strict';
const {mongoose} = require('./db/mongoose')
var express = require('express');
var cors = require('cors');
const {File} = require('./models/file');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function(req, file, cb) {
    var getFileExt = function(fileName) {
      var fileExt = fileName.split(".");
      if (fileExt.length === 1 || (fileExt[0] === "" && fileExt.length === 2)) {
        return "";
      }
      return fileExt.pop();
    };
    cb(null, Date.now() + '.' + getFileExt(file.originalname));
  }
});

const multerUpload = multer({
  storage: storage
});

var uploadFile = multerUpload.single('upfile');

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });

app.post('/api/fileanalyse', function(req, res){
  uploadFile(req, res, function(err) {
    if (err) {
      return res.json({error: err});
    }
    const fileDetails = {
      name: req.file.originalname,
      size: req.file.size,
      date: new Date().toLocaleString(),
      file: req.file.filename
    };
    const file = new File(fileDetails);
    file.save(function(err, file) {
      if (err) {
        return res.json({error: err});
      }
    });
    var filePath = "./public/uploads/" + req.file.filename; 
    fs.unlinkSync(filePath);
    res.send(fileDetails);
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});
