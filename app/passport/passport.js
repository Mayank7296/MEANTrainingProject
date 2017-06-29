var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');
var session = require('express-session');
var jwt = require('jsonwebtoken');
var secret='supersecrettokenrequiredhereforextrasecurity';


module.exports = function(app, passport){
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { secure: false }
}));
    passport.serializeUser(function(user, done) {
      token = jwt.sign({phone: user.phone, email:user.email}, secret, { expiresIn: '1h' });
        done(null, user.id);
      });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
        done(err, user);
    });
    });
  passport.use(new FacebookStrategy({
  clientID: '1689707261337410',
  clientSecret: '8dc4c706c20744092729e2be39404609',
  callbackURL: "http://localhost:55421/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'photos', 'email']
},
function(accessToken, refreshToken, profile, done) {
  // User.findOrCreate(..., function(err, user)
  //   if (err) { return done(err); }
  //   done(null, user);
  // });
    User.findOne({email: profile._json.email}).select('name password email phone').exec(function(err,user){
      if(err) done(err);

      if(user && user!=null){
        done(null,user);
      }else{
        done(err);
      }
    });

    //console.log(profile._json.email);

  done(null, profile);
}
));

app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req,res){
  res.redirect('/facebook/'+token);
});
app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

    return passport;
}
