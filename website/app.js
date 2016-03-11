var express = require('express');
var index = require('./routes/index');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var FacebookStrategy = require('passport-facebook').Strategy;
var passport = require('passport');
var session = require('express-session');
// var auth = require('./auth.js');
var auth = require('./auth_public.js');
var routes = require("./routes/index");
var newTwote = require("./routes/newTwote");
var delTwote = require("./routes/delTwote");
var hbs = require('hbs')

var app = express();

var PORT = process.env.PORT || 3000;

mongoose.connect(auth.MONGO_URI);
var User = require('./models/model.js');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
hbs.registerHelper('raw-helper', function(options) {
    return options.fn();
});
// app.engine('handlebars', engines.handlebars);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ 
  secret: 'superS3CRE7',
  resave: false,
  saveUninitialized: false ,
  cookie: {}
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new FacebookStrategy({
    clientID: auth.FACEBOOK_APP_ID,
    clientSecret: auth.FACEBOOK_APP_SECRET,
    callbackURL: auth.FACEBOOK_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ oauthID: profile.id }, function(err, user) {
      if(err) {
        console.log(err);  // handle errors!
      }
      if (!err && user !== null) {
        done(null, user);
      } else {
        user = new User({
          oauthID: profile.id,
          name: profile.displayName,
          created: Date.now()
        });
        user.save(function(err) {
          if(err) {
            console.log(err);  // handle errors!
          } else {
            console.log("saving user ...");
            done(null, profile);
          }
        })
      }
    })
  }
));

app.get('/', routes.home);
app.get('/question', routes.question);
app.get('/board', routes.board);
app.get('/searchOverSleep', routes.searchOverSleep);
app.get('/searchSleepDep', routes.searchSleepDep);
app.get('/api/getUser', routes.getUser);

app.post('/newTwote', newTwote.newTwotePOST);
app.post('/delTwote', delTwote.delTwotePOST);


app.listen(PORT, function () {
  console.log("Application running on port:", PORT);
});


// serialize and deserialize
passport.serializeUser(function(user, done) {
  console.log('serializeUser: ' + user._id);
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user){
      if(!err) done(null, user);
      else done(err, null);
    });
});

app.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res){}
);
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/question');
  }
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

  app.get('/user', ensureAuthenticated, function(req, res) {
  res.send(req.user);
})

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}

