import passport from 'passport';
import jwt from 'jsonwebtoken';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const GoogleStrategy = require('passport-google-oauth2').Strategy;

import { createUser, findUserByEmail } from '../utils/dbHelper';
import { ENV } from '../config/env';

const strategyOptions = {
  clientID: ENV.GOOGLE_OAUTH_CLIENT_ID,
  clientSecret: ENV.GOOGLE_OAUTH_SECRET_KEY,
  callbackURL: ENV.GOOGLE_OAUTH_REDIRECT_URL,
  passReqToCallback: true,
};

passport.use(
  new GoogleStrategy(strategyOptions, async function (
    request: any,
    accessToken: any,
    refreshToken: any,
    profile: any,
    done: any,
  ) {
    let user: any;
    user = await findUserByEmail(profile.email);
    if (!user) {
      user = await createUser({
        email: profile.email,
        name: profile.displayName,
      });
      //have to create new user here
    }
    user.active = true;
    const jwtPayload = {
      user,
      iat: Math.round(new Date().getTime() / 1000),
    };

    const token = jwt.sign(JSON.stringify(jwtPayload), ENV.JWT_SECRET_KEY);
    profile.token = token;
    return done(null, profile);
  }),
);

passport.serializeUser((user: any, done: any) => {
  done(null, user);
});

passport.deserializeUser((user: any, done: any) => {
  done(null, user);
});
