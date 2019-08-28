'use strict'

const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        maxlength: [20, 'description too long']
    },
    duration: {
        type: Number,
        required: true,
        min: [1, 'duration too short']
    },
    date: {
        type: Date,
        default: Date.now
    },
    username: String,
    userId: {
        type: String,
        ref: 'Users', // reference Users Model
        index: true
    }
});

exerciseSchema.pre('save', function(next) {
    mongoose.model('Users').findById(this.userId, (err, user) => {
        if(err) return next(err);
        if(!user) { // create and pass error if the user is not found by userId before save newly-created exercise doc
            const err = new Error('unknown userId'); // will inherit Error's props(message, name='Error') and methods(toString)
            err.status = 400
            return next(err) // alternative: next({status: 400, message: 'unkown userId'}) => will be responded with err message(string)
        }
        this.username = user.username // this = exercise doc
        //DOTO: why need this when we have default value set in scehma?
        if(!this.date) {
            this.date = Date.now()
        }
        next();
    })
})

module.exports = mongoose.model('Exercise', exerciseSchema);