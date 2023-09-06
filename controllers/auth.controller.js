import passport from "passport";
import jwt from "jsonwebtoken";
import Account from "../models/accounts.model.js";

export async function getAccount(token) {
  try {
    // Verify the token to get the user's ID
   const decodedToken = jwt.verify(token, "EBEC68865FBD4F7A8B6DAA2C9F711");
    // Fetch the user from the database using the ID obtained from the token
    const account = await Account.find({ _id: decodedToken.id });

    if (!account) {
      throw new Error("User not found");
    }

    return account;
  } catch (error) {
    // Handle token verification errors or user not found
    throw new Error("Authentication failed");
  }
}

export const signup = async (req, res) => {
  console.log(req.body);

  // generate salt and hash out of the p/w
  const accountDao = new Account(req.body);
  accountDao.encryptPassword(req.body.password);
  console.log(accountDao);
  // TODO: remove the password from the dao object -- how to remove prop from obj
  const result = await accountDao.save();

  if (!result.errors) {
    res.status(201).json({
      status: "Account Created Successfully",
    });
  } else {
    res.json(err);
  }
};

export const login = (req, res, next) => {
  console.log(req.body);
  // check the auth creds in db
  // send token

  // will auth using passport's local strategy
  passport.authenticate("local", function (err, account, info) {
    // if passport throws error
    if (err) {
      res.json(err);
    }

    // if account is found
    if (account) {
      // generate token and send it in res
      const authToken = account.generateJWT();
      res.json({
        status: "Logging Successfully!",
        token: authToken,
      });
    } else {
      res.json({
        status: info.message,
      });
    }
  })(req, res, next);
};
