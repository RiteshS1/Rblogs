const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true, 
  },
  summary: {
    type: String,
    required: true, 
  },
  content: {
    type: String,
    required: true, 
  },
  cover: {
    type: String,
    required: true, 
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true, 
  },
}, {
  timestamps: true,
});

const PostModel = model('Post', PostSchema);

module.exports = PostModel;
