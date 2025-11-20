const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const postSchema = new mongoose.Schema ({
    user_id: {type: Schema.Types.ObjectId, ref: "User", required: true},
    text: {type: String, required: true},
    timestamp: {type: Date, default: Date.now},
    likes: {type: Number, required: true, default: 0},
    image: {type: String, required: false},
    likedBy: [{type: Schema.Types.ObjectId, ref: "User"}]
});

module.exports = mongoose.model('Post', postSchema);