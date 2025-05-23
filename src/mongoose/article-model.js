const mongoose = require('mongoose');

const Article = mongoose.model('Article', { uuid: String, title : String, content : String, author : String }, 'articles');

module.exports = Article;