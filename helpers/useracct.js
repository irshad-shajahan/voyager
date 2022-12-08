var db = require("../config/connection");
const bcrypt = require("bcrypt");
const collections = require("../config/collection");
const { CURSOR_FLAGS, ObjectId } = require("mongodb");


module.exports = {
  getuser: (userid) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.USERS_COLLECTION)
        .findOne({ _id: ObjectId(userid) })
        .then((response) => {
          resolve(response);
        });
    });
  },
  updateuser: (user, userid) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.USERS_COLLECTION)
        .updateOne(
          { _id: ObjectId(userid) },
          { $set: { FName: user.fname, Phone: user.pname, Email: user.email } }
        )
        .then(() => {
          resolve();
        });
    });
  },
  password: (userid, data) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collections.USERS_COLLECTION)
        .findOne({ _id: ObjectId(userid) })
        .then((response) => {
          bcrypt.compare(data.password, response.Password).then(async (res) => {
            if (res) {
              data.newpassword = await bcrypt.hash(data.newpassword, 10);
              db.get()
                .collection(collections.USERS_COLLECTION)
                .updateOne(
                  { _id: ObjectId(userid) },
                  { $set: { Password: data.newpassword } }
                )
                .then((res) => {
                  resolve();
                });
            } else {
              reject();
            }
          });
        });
    });
  },
};
