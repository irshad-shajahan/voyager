const { ObjectId } = require("mongodb");
var paypal = require("paypal-rest-sdk");
const collection = require("../config/collection");
var db = require("../config/connection");
require('dotenv').config()
const clientId=process.env.CLIENT_ID
const clientSecret=process.env.CLIENT_SECRET

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:clientId,
  client_secret:clientSecret
});

module.exports = {
  items: (userid) => {
    return new Promise(async (resolve, reject) => {
      let products = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .aggregate([
          {
            $match: {
              user: ObjectId(userid),
            },
          },
          {
            $unwind: "$product",
          },
          {
            $project: {
              proid: "$product.item",
              quantity: "$product.quantity",
            },
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              localField: "proid",
              foreignField: "_id",
              as: "orderitem",
            },
          },
          {
            $project: {
              proid: 1,
              quantity: 1,
              orderlist: {
                $arrayElemAt: ["$orderitem", 0],
              },
            },
          },
          {
            $project: {
              _id: 0,
              proid: 1,
              orderlist: 1,
              quantity: 1,
            },
          },
          {
            $project: {
              name: "$orderlist.Name",
              total: "$orderlist.Price",
              quantity: 1,
            },
          },
          {
            $addFields: {
              price: {
                $toInt: ["$total"],
              },
            },
          },
          {
            $project: {
              name: "$name",
              sku: "item",
              price: {
                $round: [
                  {
                    $multiply: ["$price", 0.012],
                  },
                  0,
                ],
              },
              currency: "USD",
              quantity: "$quantity",
            },
          },
        ])
        .toArray();
            console.log('papaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaal');
      console.log(products);

      resolve(products);
    });
  },
  createorder: (items, total) => {
    return new Promise((resolve, reject) => {
      const create_payment_json = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url: "http://voyagergears.tk/verifyPaypal",
          cancel_url: "http://voyagergears.tk/cancel",
        },
        transactions: [
          {
            item_list: {
              items: items,
            },
            amount: {
              currency: "USD",
              total: total,
            },
            description: "This is the payment description.",
          },
        ],
      };
      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          throw error;
        } else {
          console.log("Create Payment Response");
          console.log(payment);
          resolve(payment);
        }
      });
    });
  },
  verify: (payerId, paymentId, total) => {
    return new Promise((resolve, reject) => {
      const execute_payment_json = {
        payer_id: payerId,
        transactions: [
          {
            amount: {
              currency: "USD",
              total: total,
            },
          },
        ],
      };

      paypal.payment.execute(
        paymentId,
        execute_payment_json,
        function (error, payment) {
          if (error) {
            console.log(error.response);
            throw error;
          } else {
            console.log(JSON.stringify(payment));
            resolve();
          }
        }
      );
    });
  },
};
