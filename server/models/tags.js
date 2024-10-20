// Tag Document Schema
var mongoose = require('mongoose');
var TagsSchema = new mongoose.Schema({
    name: {type: String, required: true},
});

TagsSchema
.virtual('url')
.get(function () {
  return '/posts/tag/' + this._id;
});

module.exports = mongoose.model('Tags', TagsSchema);