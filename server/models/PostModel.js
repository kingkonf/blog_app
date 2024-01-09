const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    title: String,
    desc: String,
    file: String,
    category: String,
    email: String,
})

const PostModel = mongoose.model('posts',UserSchema)
module.exports = PostModel;