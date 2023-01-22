const mongoose = require('mongoose');
const { Schema } = mongoose;
const NotesSchema = new mongoose.Schema({
  title: {
    type: String,
    reqired: true
  },
  description: {
    type: String,
    required: true
  },
  tag: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
});

module.ex = mongoose.model('notes', NotesSchema);