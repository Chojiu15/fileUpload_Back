const mongoose = require('mongoose')


const User = new mongoose.Schema({
    name : String,
    image : String
})


module.exports = mongoose.model('User', User)