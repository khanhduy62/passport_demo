const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require("express-session");
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const app = express();

const port = 3000;

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ secret: "cats" }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => res.render('index'))

app.route('/login')
.get((req, res) => res.render('login'))
.post(passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/' }))


app.get('/private', (req, res) => {
  if (req.isAuthenticated()) {
    return res.send('ban da chung thuc thanh cong');
  } else {
    return res.send('ban chua chung thuc duoc !!!!')
  }
})

app.get('/auth/fb',passport.authenticate('facebook'));

app.get('/auth/fb/cb',
 passport.authenticate('facebook', { successRedirect: '/',
 failureRedirect: '/login' }));

passport.use(new LocalStrategy(
  (username, password, done) => {
    if (username == "duy" && password == "123") {
      const user = {
        username,
        password
      }
      return done(null, user)
    } 
    return done(null, false)
  }
))

passport.use(new FacebookStrategy({
  clientID: "202986280566274",
  clientSecret: "d8bf45b0e55aa9806e363607796808c5",
  callbackURL: "https://localhost:3000/auth/fb/cb",
  profileFields: ['id', 'displayName', 'photos', 'email']
},
function(accessToken, refreshToken, profile, done) {
  console.log("accessToken: ", accessToken)
  console.log("refreshToken: ", refreshToken)
  console.log("profile: ", profile)
    done(null, profile);
}
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log("cookie ", user)
    done(null, user);
});

var https = require('https');
var fs = require('fs');

var options = {
  key: fs.readFileSync( '/Users/duyle/Documents/NodeJS/passport_demo/localhost.key' ),
  cert: fs.readFileSync( '/Users/duyle/Documents/NodeJS/passport_demo/localhost.crt' ),
  requestCert: false,
  rejectUnauthorized: false
};

var server = https.createServer( options, app );

server.listen( port, function () {
  console.log( 'Express server listening on port ' );
} );