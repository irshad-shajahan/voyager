var db = require("../config/connection");
var collection = require("../config/collection");
const { ObjectId } = require("mongodb");
const Razorpay = require("razorpay");
const userHelpers = require("./user-helpers");
const { time } = require("console");
const keyId=process.env.KEY_ID
const keySecret=process.env.KEY_SECRET
var instance = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});
module.exports = {
  placeOrder: (order, products, total, code) => {
    return new Promise(async (resolve, reject) => {
      if(order.paymentMethod == "COD"){
        var status="Success"
      }else if(order.paymentMethod == "wallet"){
    
      let userwallet=await userHelpers.wallet(order.userId)
      let balance=userwallet.Amount
      if(total.total<balance){
        status="Success"
      }else{
        status="Pending"
      }
      }else{
        status="Pending"
      }
      let orderObj = {
        userId: ObjectId(order.userId),
        Name: order.Name,
        paymentMethod: order.paymentMethod,
        products: products,
        totalAmount: total,
        status: status,
        coupon: order.code,
        deliveryDetails: {
          phone: order.Phone,
          address: order.Address,
          city: order.City,
          state: order.State,
          pincode: order.Pin,
          email: order.Email,
        },
        Order_date:
          new Date().getDate() +
          "-" +
          (new Date().getMonth() + 1) +
          "-" +
          new Date().getFullYear(),
        orderTime: new Date().getHours() + ":" + new Date().getMinutes(),
        time: new Date().getTime(),
      };
      db.get()
        .collection(collection.ORDER_COLLECTION)
        .insertOne(orderObj)
        .then((id) => {
          customer = {
            _id: ObjectId(order.userId),
            Name: order.Name,
            Mobile: order.Phone,
            Email: order.Email,
            Address: order.Address,
            City: order.City,
            Pin: order.Pin,
          }
              db.get()
                .collection(collection.USERS_COLLECTION)
                .updateOne(
                  {
                    _id: ObjectId(order.userId),
                  },
                  {
                    $addToSet: {
                      Applied_Coupond: order.code,
                    },
                  }
                )
                .then(() => {
                  if(order.paymentMethod == "paypal"){
                    resolve(id);
                  }else{
                    
                    db.get().collection(collection.CART_COLLECTION).deleteOne({user:ObjectId(order.userId)}).then(()=>{
  
                      resolve(id);
                    })
                  }
            });
        });
    });
  },

  getUserOrders: (userId,firstindex,limit) => {
    return new Promise(async (resolve, reject) => {
      let orders = await db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .find({ userId: ObjectId(userId) })
        .sort({ time: -1 }).skip(firstindex).limit(limit)
        .toArray();

      resolve(orders);
    });
  },
  getUserOrdersCount: (userId) => {
    return new Promise(async (resolve, reject) => {
      let orders = await db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .find({ userId: ObjectId(userId) })
        .sort({ time: -1 })
        .toArray();

      resolve(orders);
    });
  },
  getOrderProducts: (userId) => {
    return new Promise(async (resolve, reject) => {
      let orderItems = await db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .aggregate([
          {
            $match: {
              userId: ObjectId(userId),
            },
          },
          {
            $project: {
              item: "$products.item",
              quantity: "$products.quantity",
              orderStatus: "$products.orderStatus",
              userId: 1,
              paymentMethod: 1,
              totalAmount: "$totalAmount.total",
              status: 1,
              deliveryDetails: 1,
              Order_date: 1,
              orderTime: 1,
              time: 1,
              coupon: 1,
            },
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              orderStatus: 1,
              product: 1,
              userId: 1,
              paymentMethod: 1,
              totalAmount: 1,
              status: 1,
              deliveryDetails: 1,
              Order_date: 1,
              orderTime: 1,
              time: 1,
              coupon: 1,
            },
          },
          {
            $sort: { time: -1 },
          },
        ])
        .toArray();
      resolve(orderItems);
    });
  },

  getadminOrderProducts: () => {
    return new Promise(async(resolve,reject)=>{
      let adminorders=await db.get().collection(collection.ORDER_COLLECTION).find().sort({ time: -1 }).toArray()
      resolve(adminorders)
    })
  },
  updateOrderUser: (orderId, productId, action, userid, refundAmount) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.ORDER_COLLECTION)
        .updateOne(
          { _id: ObjectId(orderId), "products.item": ObjectId(productId) },
          {
            $set: {
              "products.$.orderStatus": action,
            },
          }
        )
        .then(async (response) => {
          if(action=='Cancelled'){
            let check = await db
            .get()
            .collection(collection.ORDER_COLLECTION)
            .findOne({
              $and: [{ _id: ObjectId(orderId) }, { paymentMethod: "COD" }],
            });
          if (check) {
            resolve(response);
          } else {
            db.get()
              .collection(collection.WALLET_COLLECTION)
              .updateOne(
                {
                  _id: ObjectId(userid),
                },
                {
                  $push: {
                    history: {
                      Name: "Refund of the order: " + orderId,
                      Date_Joined:
                        new Date().getDate() +
                        "-" +
                        (new Date().getMonth() + 1) +
                        "-" +
                        new Date().getFullYear(),
                      credited: refundAmount,
                      time: new Date().getTime(),
                    },
                  },
                  $inc: { Amount: refundAmount },
                }
              )
              .then(() => {
                resolve(response);
              });
          }
          }else{
            resolve(response)
          }
          
        });
    });
  },
  updateOrderAdmin: (data) => {
    
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.ORDER_COLLECTION)
        .updateOne(
          {
            userId: ObjectId(data.userId),
            _id: ObjectId(data.orderId),
            "products.item": ObjectId(data.proId),
          },
          {
            $set: {
              "products.$.orderStatus": data.action,
            },
          }
        )
        .then(async (response) => {
          if(data.action=='Cancelled'){
            let check = await db
            .get()
            .collection(collection.ORDER_COLLECTION)
            .findOne({
              $and: [{ _id: ObjectId(data.orderId) }, { paymentMethod: "COD" }],
            });
          if (check) {
            resolve(response);
          } else {
            db.get()
              .collection(collection.WALLET_COLLECTION)
              .updateOne(
                {
                  _id: ObjectId(data.userId),
                },
                {
                  $push: {
                    history: {
                      Name: "Refund of the order: " + data.orderId,
                      Date_Joined:
                        new Date().getDate() +
                        "-" +
                        (new Date().getMonth() + 1) +
                        "-" +
                        new Date().getFullYear(),
                      credited: data.refundAmount,
                      time: new Date().getTime(),
                    },
                  },
                  $inc: { Amount: parseInt(data.refundAmount )},
                }
              )
              .then(() => {
                resolve(response);
              });
          }
          }else if(data.action=='Refund Credited'){
            db.get()
              .collection(collection.WALLET_COLLECTION)
              .updateOne(
                {
                  _id: ObjectId(data.userId),
                },
                {
                  $push: {
                    history: {
                      Name: "Refund of the order: " + data.orderId,
                      Date_Joined:
                        new Date().getDate() +
                        "-" +
                        (new Date().getMonth() + 1) +
                        "-" +
                        new Date().getFullYear(),
                      credited: data.refundAmount,
                      time: new Date().getTime(),
                    },
                  },
                  $inc: { Amount: parseInt(data.refundAmount ) },
                }
              )
              .then(() => {
                resolve(response);
              });

          }
          else{
            resolve(response)
          }
          
        });
    });
  },
  getOrders: () => {
    return new Promise((resolve, reject) => {
      let order = db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .find()
        .sort({ time: -1 })
        .toArray();
      resolve(order);
    });
  },
  generateRazorpay: (orderId, total) => {
    let totalamount=parseInt(total.total)
    return new Promise((resolve, reject) => {
      var options = {
        amount: totalamount * 100,
        currency: "INR",
        receipt: "" + orderId,
      };
      instance.orders.create(options, function (err, order) {
        if (err) {
        } else {
          resolve(order);
        }
      });
    });
  },
  verifyPayment: (details) => {
    return new Promise((resolve, reject) => {
      const crypto = require("crypto");
      let hmac = crypto.createHmac("sha256", "K1EMyL9jPKxm3jETJr4sApiW");
      hmac.update(
        details["payment[razorpay_order_id]"] +
          "|" +
          details["payment[razorpay_payment_id]"]
      );
      hmac = hmac.digest("hex");
      if (hmac == details["payment[razorpay_signature]"]) {
        resolve();
      } else {
        reject();
      }
    });
  },
  changePaymentStatus: (orderId,userId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.ORDER_COLLECTION)
        .updateOne(
          { _id: ObjectId(orderId) },
          {
            $set: {
              status: "Success",
            },
          }
        )
        .then((response) => {
          db.get().collection(collection.CART_COLLECTION).deleteOne({user:ObjectId(userId)}).then(()=>{

            resolve(response);
          })
        });
    });
  },
  walletPayment:(orderId,userId,amount)=>{
    return new Promise(async(resolve,reject)=>{
      let userwallet=await userHelpers.wallet(userId)
      let balance=userwallet.Amount
      if(amount<balance){
        db.get()
        .collection(collection.WALLET_COLLECTION)
        .updateOne(
          {
            _id: ObjectId(userId),
          },
          {
            $push: {
              history: {
                Name: "Payment done for the order: " + orderId,
                Date_Joined:
                  new Date().getDate() +
                  "-" +
                  (new Date().getMonth() + 1) +
                  "-" +
                  new Date().getFullYear(),
                credited: -amount,
                time: new Date().getTime(),
              },
            },
            $inc: { Amount: -parseInt(amount) },
          }
        )
        .then(() => {
          resolve(true);
        });
      }else{
        resolve(false)
      }
    })
  },
  deletePending:(userId)=>{
    return new Promise((resolve,reject)=>{
      db.get().collection(collection.ORDER_COLLECTION).deleteMany({
        status:"Pending"
      })
      resolve()
    })
  }
};
