var db = require("../config/connection");
var collection = require("../config/collection");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
let referralCodeGenerator = require("referral-code-generator");
module.exports = {
  doSignup: (userData) => {
    userData.Address = [];
    return new Promise(async (resolve, reject) => {
      userData.Password = await bcrypt.hash(userData.Password, 10);
      userData.Referral_Code = referralCodeGenerator.alpha("uppercase", 6);
      let email = await db
        .get()
        .collection(collection.USERS_COLLECTION)
        .findOne({ Email: userData.Email });
      if (email) {
        resolve(email);
      } else {
        let phone = await db
          .get()
          .collection(collection.USERS_COLLECTION)
          .findOne({ Phone: userData.Phone });
        if (phone) {
          resolve(phone);
        } else {
          reff = await db.get().collection(collection.USERS_COLLECTION).findOne({ Referral_Code: userData.referral })
          if (reff) {
            let wall = await db.get().collection(collection.WALLET_COLLECTION).findOne({ _id: reff._id })
            console.log("if entered");
            console.log(wall);
            if (wall) {
              db.get().collection(collection.WALLET_COLLECTION).updateOne(
                {
                  _id: ObjectId(reff._id)

                },
                {
                  $push: {
                    history: {
                      Name: userData.FName + " (Referral)", Date_Joined: new Date().getDate() +
                        "-" +
                        (new Date().getMonth() + 1) +
                        "-" +
                        new Date().getFullYear(),
                        credited:500,
                    }
                  },
                  $inc: { Amount: 500 }
                }
              )
            } else {
              naame = userData.FName
              exiswal = {
                _id: ObjectId(reff._id),
                Name: reff.FName,
                Amount: 500,
                history: [{
                  Name: naame + ' (referral)',
                  Date_Joined: new Date().getDate() +
                    "-" +
                    (new Date().getMonth() + 1) +
                    "-" +
                    new Date().getFullYear(),
                  credited: 500

                }]


              }
              db.get().collection(collection.WALLET_COLLECTION).insertOne(exiswal)

            }

          }
          userData.status = true;
          userData.Address = [];

          db.get()
            .collection(collection.USERS_COLLECTION)
            .insertOne(userData)
            .then(async (data) => {
              checkk = await db.get().collection(collection.USERS_COLLECTION).findOne({ Referral_Code: userData.referral })
              if (checkk) {
                newwall = {
                  _id: ObjectId(data.insertedId),
                  Name: userData.FName,
                  Amount: 1000,
                  history: [
                    {
                      Name: 'joining bonus',
                      credited: 1000,
                      Date_Joined: new Date().getDate() +
                        "-" +
                        (new Date().getMonth() + 1) +
                        "-" +
                        new Date().getFullYear()
                    }
                  ]
                }
                db.get().collection(collection.WALLET_COLLECTION).insertOne(newwall)
              } else {
                emptynewwall = {
                  _id: ObjectId(data.insertedId),
                  Name: userData.FName,
                  Amount: 0,
                  history: []
                }
                db.get().collection(collection.WALLET_COLLECTION).insertOne(emptynewwall)
              }
              resolve(data);
              console.log(data.insertedId);
            });
        }
      }
    });
  },
  doLogin: (userData) => {
    return new Promise(async (resolve, reject) => {
      let loginStatus = false;
      let response = {};
      console.log(userData);
      let customer = await db
        .get()
        .collection(collection.USERS_COLLECTION)
        .findOne({ Email: userData.Email });
      if (customer) {
        bcrypt.compare(userData.Password, customer.Password).then((status) => {
          if (status) {
            console.log("login-success");
            response.customer = customer;
            response.status = true;
            resolve(customer);
          } else {
            response.msg = true;
            console.log("login failed");
            response.status = false;
            resolve(response);
          }
        });
      } else {
        console.log("log failed");
        resolve({ status: false });
      }
    });
  },
  doOTP: (phone) => {
    let response = {};
    return new Promise(async (resolve, reject) => {
      let userNum = await db
        .get()
        .collection(collection.USERS_COLLECTION)
        .findOne({ Phone: phone });
      console.log("doOTP");
      if (userNum) {
        if (userNum.status) {
          console.log(userNum.status);
          response = userNum;
          response.status = true;
          console.log("dootp");
          console.log(response);
          resolve(response);
        } else {
          response.blockotp = true;
          resolve(response);
        }
      } else {
        response.status = false;
        resolve(response);
      }
    });
  },
  deleteAddress: (userId, id) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.USERS_COLLECTION)
        .updateOne(
          {
            _id: ObjectId(userId),
          },
          {
            $pull: { Address: { _id: ObjectId(id) } },
          }
        )
        .then(() => {
          resolve();
        });
    });
  },
  addNewAddress: (address) => {
    return new Promise((resolve, reject) => {
      customer = {
        _id: ObjectId(),
        Name: address.Name,
        Mobile: address.Phone,
        Email: address.Email,
        State: address.State,
        Address: address.Address,
        City: address.City,
        Pin: address.Pin,
      };
      db.get()
        .collection(collection.USERS_COLLECTION)
        .updateOne(
          {
            _id: ObjectId(address.userId),
          },
          {
            $addToSet: {
              Address: customer,
            },
          }
        )
        .then(() => {
          resolve();
        });
    });
  },
  wallet: (userid) => {
    return new Promise(async (resolve, reject) => {
      let walletBalance = await db.get().collection(collection.WALLET_COLLECTION).findOne({ _id: ObjectId(userid) })
      resolve(walletBalance)
    })
  },
  wallethist: (userid,firstindex,limit) => {
    return new Promise(async (resolve, reject) => {
      let walletHistory = await db.get().collection(collection.WALLET_COLLECTION).aggregate([
        {
          $match:{
            _id:ObjectId(userid)
          }
        },
        {
          $project:{
            history:1
          }
        },
        {
          $unwind:"$history"
        },
        {
          $project:{
            Name:"$history.Name",
            Date_Joined:"$history.Date_Joined",
            credited:"$history.credited",
            time:"$history.time"
          }
        },
        {
          $sort:{time:-1}
        }
      ]).toArray()
      console.log('++++++++++++++++++++++++++++++++++++++++++++++');
      console.log(walletHistory);
      resolve(walletHistory)
    })
  }
};
