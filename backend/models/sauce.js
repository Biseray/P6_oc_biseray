const mongoose = require('mongoose');

// schema de sauce 
const sauceSchema = mongoose.Schema({
    userId: {  type: String, require: true },
    name: { type: String, require: true },
    manufacturer: { type: String, require: true },
    description: { type: String, require: true },
    mainPepper: { type: String, require: true },
    imageUrl: { type: String, require: true },
    heat: { type: Number, require: true },
    likes: { type: Number , return :  0 },
    dislikes: { type: Number,   return : 0 },
    usersDisliked: { type: Array},
    usersLiked: { type: Array},
});

module.exports = mongoose.model('Sauce', sauceSchema);


