const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
const url = require('url');
const callbackURL = url.resolve(process.env.APP_DOMAIN,
    '/authenticate/authcallback');

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(null, user);
  });
});

passport.use(new FacebookStrategy({
  clientID: process.env.APP_ID,
  clientSecret: process.env.APP_SECRET,
  callbackURL: callbackURL,
}, (accessToken, refreshToken, profile, done) => {
  const query = {userid: profile.id};
  const doc = {
    name: profile.displayName,
    userid: profile.id,
  };

  User.findOneOrCreate(query, doc, (err, user) => {
    if (err) return done(err);
    console.log(user.isNew ? 'New user created' : 'Existing user found',
        user);
    done(null, user);
  });
}));

module.exports = passport;
