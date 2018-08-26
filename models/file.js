const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  name: String,
  size: Number,
  date: String
});

const File = mongoose.model(
  'File', 
  FileSchema
);

module.exports = {File} ;