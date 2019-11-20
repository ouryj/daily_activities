let mongoose = require('mongoose');
let storySchema = new mongoose.Schema({
    title: String,
    content: String,
    comments: [
        {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Comment'
        }
    ],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    created:{type:Date,default:Date.now}
})
module.exports = mongoose.model('Story', storySchema);