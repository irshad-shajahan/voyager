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
      console.log(user);
      console.log(userid);
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
              console.log(data.newpassword);
              data.newpassword = await bcrypt.hash(data.newpassword, 10);
              console.log("hai");
              console.log(userid);
              console.log(data.newpassword);
              db.get()
                .collection(collections.USERS_COLLECTION)
                .updateOne(
                  { _id: ObjectId(userid) },
                  { $set: { Password: data.newpassword } }
                )
                .then((res) => {
                  console.log(res);

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
