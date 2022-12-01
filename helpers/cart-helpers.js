var db = require("../config/connection");
var collection = require("../config/collection");
const { ObjectId } = require("mongodb");
module.exports={
    addToCart: (proId, userId) => {
        let proObj = {
          item: ObjectId(proId),
          quantity: 1,
        };
        console.log("add to cart helper called");
        return new Promise(async (resolve, reject) => {
          let userCart = await db
            .get()
            .collection(collection.CART_COLLECTION)
            .findOne({ user: ObjectId(userId) });
          console.log(userCart);
          if (userCart) {
            console.log(proId);
            let proExist = userCart.product.findIndex(
              (product) => product.item == proId
            );
            console.log(proExist);
            if (proExist != -1) {
              db.get()
                .collection(collection.CART_COLLECTION)
                .updateOne(
                  {user:ObjectId(userId), "product.item": ObjectId(proId) },
                  {
                    $inc: { "product.$.quantity": 1 },
                  }
                )
                .then(() => {
                  resolve();
                });
            } else {
              db.get()
                .collection(collection.CART_COLLECTION)
                .updateOne(
                  { user: ObjectId(userId) },
                  {
                    $push: { product: proObj },
                  }
                )
                .then((response) => {
                  console.log(response);
                  resolve(response);
                });
            }
          } else {
            let cartObj = {
              user: ObjectId(userId),
              product: [proObj],
            };
            db.get()
              .collection(collection.CART_COLLECTION)
              .insertOne(cartObj)
              .then((response) => {
                resolve();
              });
          }
        });
      },
      changeProductQuantity: (details) => {
        count=parseInt(details.count)
        quantity=parseInt(details.quantity)
        return new Promise((resolve, reject) => {
            if(count==-1 && quantity==1){
                db.get().collection(collection.CART_COLLECTION).updateOne({_id:ObjectId(details.cart)},
                {
                    $pull:{product:{item:ObjectId(details.product)}}
                }).then((response)=>{
                    resolve({removeProduct:true})
                })
            }else{
                db.get()
                  .collection(collection.CART_COLLECTION)
                  .updateOne(
                    {_id:ObjectId(details.cart), 'product.item': ObjectId(details.product) },
                    {
                      $inc: { 'product.$.quantity': count },
                    }
                  )
                  .then((response) => {
                    resolve(true)
                  })
            }
        })
      },
      getCartCount: (userId) => {
        let count = 0;
        return new Promise(async (resolve, reject) => {
          let cart = await db
            .get()
            .collection(collection.CART_COLLECTION)
            .findOne({ user: ObjectId(userId) });
          if (cart) {
            count = cart.product.length;
          }
          resolve(count);
        });
      },
        //  *the cart elements are displayed
  getCartProducts: (userId) => {
    return new Promise(async (resolve, reject) => {
      let cartItems = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .aggregate([
          {
            $match: {
              user: ObjectId(userId),
            },
          },
          {
            $unwind: "$product",
          },
          {
            $project: {
              item: "$product.item",
              quantity: "$product.quantity",
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
              product: { $arrayElemAt: ["$product", 0] },
            },
          },
          {
            $addFields:{
              price:{$toInt:['$product.Price']}
            }
          },
          {$project:{
            item: 1,
            quantity: 1,
            product:1,
            stotal:{
              $multiply:['$quantity','$price']
            }
          }}
        ])
        .toArray();
      resolve(cartItems);
    })
  },
  getTotalAmount:(userId)=>{
    return new Promise(async (resolve, reject) => {
      let total = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .aggregate([
          {
            $match: {
              user: ObjectId(userId),
            },
          },
          {
            $unwind: "$product",
          },
          {
            $project: {
              item: "$product.item",
              quantity: "$product.quantity",
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
              product: { $arrayElemAt: ["$product", 0] },
            },
          },
          {
            $addFields:{
              price:{$toInt:['$product.Price']}
            }
          },
          {
            $group:{
              _id:null,
              total:{$sum:{$multiply:['$quantity','$price']}}
            }
          }
        ])
        .toArray();
      resolve(total[0]);
    })
  },
  getCartProductList:(userId)=>{
    return new Promise(async (resolve, reject) => {
      let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectId(userId)})
      resolve(cart.product)
    }
    )
  },
  deleteitem: (userid, prodid) => {
    console.log("888888888888888888888888");
    console.log(userid+'******'+prodid);
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CART_COLLECTION)
        .updateOne(
          {
            user: ObjectId(userid),
          },
          {
            $pull: {
              product: { item: ObjectId(prodid) },
            },
          }
        )
        .then(() => {
          resolve();
        });
    });
  },
  selectAddress:(userId)=>{
    return new Promise(async (resolve,reject)=>{
      let address= await db.get().collection(collection.USERS_COLLECTION).aggregate([
        {
          $match: {
            _id: ObjectId(userId),
          },
        },
        {
          $unwind: "$Address",
        },
        {
          $project:{
            _id:'$Address._id',
            Name:'$Address.Name',
            State:'$Address.State',
                Mobile:'$Address.Mobile',
                Email:'$Address.Email',
                Address:'$Address.Address',
                City:'$Address.City',
                Pin:'$Address.Pin'
          }
        }
      ]).toArray()
      resolve(address)
    })
  },
  applycoupon:(data)=>{
    return new Promise(async(resolve,reject)=>{
      check= await db.get().collection(collection.COUPON_COLLECTION).findOne({Coupon_Code:data.coupon})
      if(check){
        resolve(check)
      }else{
        reject(check)
      }
    })
  },
  addToWishList:(proId,userId)=>{
    let proObj = {
      item: ObjectId(proId),
      wishStatus: true,
    };
    console.log("add to wish helper called");
    return new Promise(async (resolve, reject) => {
      let wishlist = await db
        .get()
        .collection(collection.WISH_COLLECTION)
        .findOne({ user: ObjectId(userId) });
      console.log(wishlist);
      if (wishlist) {;
        db.get()
            .collection(collection.WISH_COLLECTION)
            .updateOne(
              { user: ObjectId(userId) },
              {
                $push: { product: proObj },
              }
            )
            .then((response) => {
              console.log(response);
              resolve(response);
            });
      } else {
        let wishObj = {
          user: ObjectId(userId),
          product: [proObj],
        };
        db.get()
          .collection(collection.WISH_COLLECTION)
          .insertOne(wishObj)
          .then((response) => {
            resolve();
          });
      }
    });
  },
  getWishProducts: (userId) => {
    return new Promise(async (resolve, reject) => {
      let wishItems = await db
        .get()
        .collection(collection.WISH_COLLECTION)
        .aggregate([
          {
            $match: {
              user: ObjectId(userId),
            },
          },
          {
            $unwind: "$product",
          },
          {
            $project: {
              item: "$product.item",
              status: "$product.wishStatus",
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
              product: { $arrayElemAt: ["$product", 0] },
            },
          },
          {
            $addFields:{
              price:{$toInt:['$product.Price']}
            }
          },
          {$project:{
            item: 1,
            quantity: 1,
            product:1,
            stotal:{
              $multiply:['$quantity','$price']
            }
          }}
        ])
        .toArray();
      resolve(wishItems);
    })
  },
  removeWish:(proId,userId)=>{
  console.log("888888888888888888888888");
  console.log(userId+'******'+proId);
  return new Promise((resolve, reject) => {
    db.get()
      .collection(collection.WISH_COLLECTION)
      .updateOne(
        {
          user: ObjectId(userId),
        },
        {
          $pull: {
            product: { item: ObjectId(proId) },
          },
        }
      )
      .then((response) => {
        resolve(response);
      });
    });
    },
  getWishCount: (userId) => {
    let count = 0;
    return new Promise(async (resolve, reject) => {
      let wish = await db
        .get()
        .collection(collection.WISH_COLLECTION)
        .findOne({ user: ObjectId(userId) });
      if (wish) {
        count = wish.product.length;
      }
      resolve(count);
    });
  }

}