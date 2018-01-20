var express    = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var config = require('./config');
const apiRouter = require("../routes/index.route");
var jwt = require("jsonwebtoken");
var expressValidation = require("express-validation");
const APIError = require("../helpers/APIError");
const httpStatus = require('http-status');

//Here configure the express
var app = express();
var server = require("http").Server(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/test', function (req, res) {
    console.log(__dirname);
    res.sendFile("/Users/itilak/Desktop/WebService_Assist" + "/testFileUpload.html");
});

//Listening port
app.set('port',process.env.PORT || config.webPort);
//app.use(express.static(path.join(__dirname,'./../public')));
app.use(express.static(path.join("/Users/itilak/Desktop/WebService_Assist",'public')));

server.listen(app.get('port'),function(){
    console.log('Server listing at port ' + server.address().port);
});

// middleware to use for api requests and verify token by using jsonwebtoken.
app.use('/api', function(req, res, next) {
    console.log("Inside the function");
    // let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ODdmMjk5ZDMyZjhhNDEwZjg0NjI5OGEiLCJpYXQiOjE0ODQ3Mjg3MzMsImV4cCI6MjI0MjExMTEzM30.nhPbnJOUeGU_wSwmawCMxNFtqOURlenagKMqdhPvQnk"//req.headers['x-access-token'];
    let token = req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, config.jwtSecretKey, function (err, decoded) {
            if (err) {
                res.send({ success: false, message: "Failed to authenticate token.", error: err });
            }else {
                //console.log(decoded.userId);
                res.locals.session = decoded.userId;
                next();
            }
        })
    }else {
        res.status(403).send({ success: false, message: "Authenticate token required."});
    }
});


//all route assign here
app.use('/',apiRouter);

//Here handle an error when next with error
app.use(function (err, req, res, next) {
    console.log("inside next err call");
    if (err instanceof expressValidation.ValidationError) {
        console.log(err);
        const errorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
        return res.status(err.status).json({
            error: errorMessage
        });
    }else if (err instanceof APIError) {
        console.log(err);
        return res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: err.message
        });
    } else{
        next(err);
    }
})

// if api not found then send message
app.use(function (req, res, next) {
    console.log("inside not found");
    return res.status(404).json({ success: false, message: 'API not found.' });
})

module.exports = app;