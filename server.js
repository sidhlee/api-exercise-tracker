require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const apiRouter = require('./routes/api');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(process.cwd() + '/public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

app.use('/api/exercise', apiRouter); // mount router module on the base url: 'api/exercise'
app.use((req, res, next) => { // not found middleware
    return next({status: 404, message: 'not found'}) // if you call next with error, the express default error handler closes the connection and fails the request.
});

//error handling middleware http://expressjs.com/en/guide/error-handling.html
app.use((err, req, res, next) => { 
    let errCode, errMessage;

    if(err.errors) { // mongoose validation error
        errCode = 400 // bad request
        const keys = Object.keys(err.errors)
        errMessage = err.errors[keys[0]].message // report the frst validation error;
    } else { // generic or custom error
        errCode = err.status || 500
        errMessage = err.message || 'Internal Server Error'
    }
    res.status(errCode).type('txt')
      .send(errMessage);
})

const listener = app.listen(process.env.PORT || 3000, 
    () => {
        console.log('Your app is listening on port ' + listener.address().port)
    });

