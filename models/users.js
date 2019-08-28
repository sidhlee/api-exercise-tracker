'use strict'

const shortid = require('shortid');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        maxlength: [20, 'username too long']
    },
    _id: {
        type: String,
        // index: true, => will cause: mongoose: Cannot specify a custom index on `_id` for model name "Users", MongoDB does not allow overwriting the default `_id` index. See http://bit.ly/mongodb-id-index
        default: shortid.generate
    }
});

module.exports = mongoose.model('Users', userSchema);