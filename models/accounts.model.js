import mongoose from "./mongo.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

// defining the schema - with the field and datatype
const Account = new mongoose.Schema(
  {
    fullName: String,
    email: {
      type: String,
      unique: true,
    },
    salt: String,
    hash: String,
    createdBy: String,
    createdOn: { type: Date, default: Date.now },
    updatedBy: String,
    updatedOn: { type: Date, default: Date.now },
  },
  {
    strict: true,
  }
);

// to convert p/w into salt and hash
Account.methods.encryptPassword = function (password) {
  // do not have arrow fn -- 'this' context will differ
  this.salt = crypto.randomBytes(256).toString("hex");
  console.log(this.salt);
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 52679, 512, "sha512")
    .toString("hex");
  console.log(this.hash);
};

// Validate Password
Account.methods.validatePassword = function (password) {
  console.log(password);
  console.log(this.salt); // already saved salt
  console.log(this.hash); // already saved hash
  // newly generate hash from entered password
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 52679, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

// generateToken
Account.methods.generateJWT = function () {
  const today = new Date();
  const tokenExpirationDate = new Date(today);
  tokenExpirationDate.setDate(today.getDate() + 60);

  // signing the payload with secret
  return jwt.sign(
    {
      email: this.email,
      id: this._id,
      exp: parseInt(tokenExpirationDate.getTime() / 1000, 10),
    },
    "EBEC68865FBD4F7A8B6DAA2C9F711", // secret key,
  );
};

export default mongoose.model("Account", Account);



