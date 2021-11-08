const mongodb = require('mongodb');
const { getDatabase } = require('../config/mongo');
const { hashPassword } = require('../helpers/bcrypt');

class UsersModel {
  static async register(reqBody) {
    const { username, email, password, firstName, lastName } = reqBody;

    const db = getDatabase();
    const usersCollection = db.collection('users');
    const user = await usersCollection.insertOne({
      username,
      email,
      password: hashPassword(password),
      firstName,
      lastName,
    });

    return user;
  }

  static async login(reqBody) {
    const { email } = reqBody;
    const db = getDatabase();
    const usersCollection = db.collection('users');

    const response = await usersCollection.findOne({
      email,
    });

    return response;
  }

  static async getLoggedInUser(id, username, email) {
    const db = getDatabase();
    const usersCollection = db.collection('users');

    const foundUser = await usersCollection.findOne({
      _id: mongodb.ObjectId(id),
      username,
      email,
    });

    return foundUser;
  }

  static async getLastInsertedUser() {
    const db = getDatabase();
    const usersCollection = db.collection('users');
    const user = await usersCollection
      .find({})
      .sort({ _id: -1 })
      .limit(1)
      .toArray();

    return user;
  }
}

module.exports = UsersModel;
