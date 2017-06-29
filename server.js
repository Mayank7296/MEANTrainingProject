var express = require('express');
var app=express();
var port= process.env.PORT || 55423;
var mongoose = require('mongoose');
var morgan = require('morgan');
var router = express.Router();
var appRoutes = require('./app/routes/api')(router);
var path = require('path');
var passport = require('passport');
var social = require('./app/passport/passport')(app, passport);
//var User = require('./app/models/user');

app.use(morgan('dev'));
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(__dirname+'/public'));
app.use('/api',appRoutes);
//app.use(appRoutes);

app.get('/home',function(req,res){
  res.send('Hello friend');
})
mongoose.connect('mongodb://localhost:27017/project_training', function(err){
  if(err){
    console.log('not connected to the database'+err);
  }else{
    console.log('successfully connected to mongodb');
  }
});




app.get('*',function(req,res){
  res.sendFile(path.join(__dirname+'/public/app/views/index.html'));
});
app.listen(port, function(){
  console.log('Running the server on port '+port);
});
