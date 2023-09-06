import passport from "passport";
import LocalStrategy from "passport-local";
// import mongoose from "mongoose";
import Account from "../models/accounts.model.js";

// basic config for login using passport local
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async function (email, password, done) {
      const result = await Account.findOne({ email: email });

      if (result.errors) {
        return done(err);
      }

      // Return if account not found in database
      if (!result) {
        return done(null, false, {
          message: "Incorrect email or password.",
        });
      }

      // Return if password is wrong
      if (!result.validatePassword(password)) {
        return done(null, false, {
          message: "Password is wrong",
        });
      }
      
      // If credentials are correct, return the account object
      return done(null, result);
    }
  )
);

export default passport;
