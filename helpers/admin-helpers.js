var db=require('../config/connection');
const bcrypt=require('bcrypt');
var collection=require('../config/collection');
const {ObjectId} =require('mongodb');

module.exports={
    addUsers:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.Password=await bcrypt.hash(userData.Password,10)
            userData.status=true
            db.get().collection(collection.USERS_COLLECTION).insertOne(userData).then((data)=>{
                resolve(data)
            })
        })
},
getAllUsers:()=>{
    return new Promise(async(resolve,reject)=>{
        let users=await db.get().collection(collection.USERS_COLLECTION).find().toArray()
        resolve(users)
    })
},
blockUser:(userid)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.USERS_COLLECTION).updateOne({_id:ObjectId(userid)},{
            $set:{status:false
            }
        }).then(()=>{
            resolve()
        })
    })
},
unblockUser:(userid)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.USERS_COLLECTION).updateOne({_id:ObjectId(userid)},{
            $set:{status:true
            }
        }).then(()=>{
            resolve()
        })
    })
},
dailysale:()=>{
    test =
      new Date().getDate() +
      "-" +
      (new Date().getMonth() + 1) +
      "-" +
      new Date().getFullYear();
    return new Promise(async (resolve, reject) => {
      let dailysale = await db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .aggregate([
          {
            $match: {
              $and: [
                {
                  status: "Success",
                  
                },
                {
                  Order_date: {
                    $eq: test,
                  },
                },
              ],
            },
          },
          {
            $sort: { time: -1 }
          }
        ])
        .toArray();
      resolve(dailysale);
    });
},
weeklySale:()=>{
  return new Promise(async (resolve, reject) => {
    let data = await db
      .get()
      .collection(collection.ORDER_COLLECTION)
      .aggregate([
        {
          $match: {
            status: "Placed",
          },
        },

        {
          $addFields: {
            day: {
              $dayOfMonth: {
                $dateFromString: {
                  dateString: "$Order_date",
                },
              },
            },
            month: {
              $month: {
                $dateFromString: {
                  dateString: "$Order_date",
                },
              },
            },
            year: {
              $year: {
                $dateFromString: {
                  dateString: "$Order_date",
                },
              },
            },
          },
        },
        {
          $addFields: {
            date: {
              $dateFromParts: {
                year: "$year",
                month: "$month",
                day: "$day",
                hour: 12,
              },
            },
          },
        },
        {
          $match: {
            date: {
              $gt: new Date(new Date() - 7 * 60 * 60 * 12 * 1000),
            },
          },
        },
      ])
      .toArray();
    resolve(data);
  });
},
monthly: () => {
  return new Promise(async (resolve, reject) => {
    let data = await db
      .get()
      .collection(collection.ORDER_COLLECTION)
      .aggregate([
        {
          $match: {
            status: "Placed",
          },
        },

        {
          $addFields: {
            day: {
              $dayOfMonth: {
                $dateFromString: {
                  dateString: "$Order_date",
                },
              },
            },
            month: {
              $month: {
                $dateFromString: {
                  dateString: "$Order_date",
                },
              },
            },
            year: {
              $year: {
                $dateFromString: {
                  dateString: "$Order_date",
                },
              },
            },
          },
        },
        {
          $addFields: {
            date: {
              $dateFromParts: {
                year: "$year",
                month: "$month",
                day: "$day",
                hour: 12,
              },
            },
          },
        },
        {
          $match: {
            date: {
              $gt: new Date(new Date() - 30 * 60 * 60 * 12 * 1000),
            },
          },
        },
      ])
      .toArray();
    resolve(data);
  });
},
amount: () => {
  return new Promise(async(resolve, reject) => {
    Amount = await db
      .get()
      .collection(collection.ORDER_COLLECTION)
      .aggregate([
        {
          $group: {
            _id: "$paymentMethod",
            Total: {
              $sum: "$totalAmount.total",
            },
          },
        },
      ])
      .toArray();
    resolve(Amount);
  });
},
chartPayment: () => {
  return new Promise(async (resolve, reject) => {
    Chart = await db
      .get()
      .collection(collection.ORDER_COLLECTION)
      .aggregate([
        {
          $group: {
            _id: "$paymentMethod",
            Total: {
              $count: {},
            },
          },
        },
      ])
      .toArray();
    resolve(Chart);
  });
},
getYearly: () => {
  return new Promise(async (resolve, reject) => {
    var graphDta = await db
      .get()
      .collection(collection.ORDER_COLLECTION)
      .aggregate([
        {
          $project: {
            day: {
              $dayOfMonth: {
                $dateFromString: {
                  dateString: "$Order_date",
                },
              },
            },
            month: {
              $month: {
                $dateFromString: {
                  dateString: "$Order_date",
                },
              },
            },
            year: {
              $year: {
                $dateFromString: {
                  dateString: "$Order_date",
                },
              },
            },
          },
        },
        {
          $group: {
            _id: {
              // day: "$day",
              month: "$month",
              // year: "$year"
            },
            Total: {
              $count: {},
            },
          },
        },
      ])
      .toArray();
    resolve(graphDta);
  });
},
couponAdd:(data)=>{
  return new Promise((resolve,reject)=>{
    coup={
      Coupon_Code:data.code,
      Expiry:new Date(data.expiry),
      Max_Amount:parseInt(data.max),
      Min_Amount:parseInt(data.min),
      Discount_Percentage:parseInt(data.percentage)
    }
    db.get().collection(collection.COUPON_COLLECTION).insertOne(coup).then(()=>{
      resolve()
    })
  })
},
coupons:()=>{
  return new Promise(async(resolve,reject)=>{
   const coups=await db.get().collection(collection.COUPON_COLLECTION).find().toArray()
    resolve(coups)
  })
},
deletecoupon:(id)=>{
  return new Promise((resolve,reject)=>{
    db.get().collection(collection.COUPON_COLLECTION).deleteOne({_id:ObjectId(id)}).then(()=>{
      resolve()
    })
  })

},
bannerAdd:async(banner)=>{
  return new Promise((resolve,reject)=>{
    db.get().collection(collection.BANNER_COLLECTION).insertOne(banner).then((data)=>{
      resolve(data)
    })
  })
},
banners:()=>{
  return new Promise(async(resolve,reject)=>{
   await db.get().collection(collection.BANNER_COLLECTION).find().toArray().then((data)=>{
      resolve(data)
    })
  })
},
deletebanner:(bannerid)=>{
    db.get().collection(collection.BANNER_COLLECTION).deleteOne({ _id: ObjectId(bannerid) }).then((response)=>{
      resolve(response)
    })
},
banstatus:(data)=>{
  return new Promise((resolve,reject)=>{

    db.get().collection(collection.BANNER_COLLECTION).updateOne({ _id: ObjectId(data.id) },
    {
      $set:{
  
        status:data.status
      }
    }
    ).then((response)=>{
      resolve(response)
    })
  })
},
bannershome:()=>{
  return new Promise((resolve,reject)=>{
    db.get().collection(collection.BANNER_COLLECTION).findOne({status:true}).then((response)=>{
      resolve(response)
    })
  })
},
AnnualSale: () => {
  return new Promise(async (resolve, reject) => {
    let data = await db
      .get()
      .collection(collection.ORDER_COLLECTION)
      .aggregate([
        {
          $match: {
            status: "Success",
          },
        },

        {
          $addFields: {
            day: {
              $dayOfMonth: {
                $dateFromString: {
                  dateString: "$Order_date",
                },
              },
            },
            month: {
              $month: {
                $dateFromString: {
                  dateString: "$Order_date",
                },
              },
            },
            year: {
              $year: {
                $dateFromString: {
                  dateString: "$Order_date",
                },
              },
            },
          },
        },
        {
          $addFields: {
            date: {
              $dateFromParts: {
                year: "$year",
                month: "$month",
                day: "$day",
                hour: 12,
              },
            },
          },
        },
        {
          $match: {
            date: {
              $gt: new Date(new Date() - 300 * 60 * 60 * 12 * 1000),
            },
          },
        },
      ])
      .toArray();
    resolve(data);
    });
  },
fromTo: (dates) => {
  return new Promise(async (resolve, reject) => {
    if (dates.FromDate.trim().length === 0) {
      var from = new Date();
      from.setUTCHours(0, 0, 0, 0);
    } else {
      var from = new Date(dates.FromDate);
    }
    if (dates.ToDate.trim().length === 0) {
      var to = new Date();
      to.setUTCHours(0, 0, 0, 0);
    } else {
      var to = new Date(dates.ToDate);
    }
    let Data = await db
      .get()
      .collection(collection.ORDER_COLLECTION)
      .aggregate([
        {
          $match: {
            status: "Success",
          },
        },
        {
          $addFields: {
            date: {
              $dateFromString: {
                dateString: "$Order_date",
              },
            },
          },
        },
        {
          $match: { date: { $gte: from, $lte: to } },
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            totalAmount: '$totalAmount.total',
            date: 1,
            products: 1,
            Order_date: 1,
          },
        },
        {
          $unwind: "$products",
        },
        {
          $project: {
            product: "$products.item",
            name: "$products.product.Name",
            quantity: "$products.quantity",
            Total: "$products.stotal",
          },
        },
        {
          $group: {
            _id: "$product",
            quantity: { $sum: "$quantity" },
            total: { $sum: "$Total" },
          },
        },
        {
          $lookup: {
            from: collection.PRODUCT_COLLECTION,
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $addFields: {
            products: { $arrayElemAt: ["$product", 0] },
          },
        },
        {
          $project: {
            _id: 1,
            quantity: 1,
            total: 1,
            productName: "$products.Name",
            brand: "$products.Brand",
            category: "$products.Category",
          },
        },
      ])
      .toArray();
    resolve(Data);
    });
  },
getSalesByMonth: (dateData) => {
  datamonth = parseInt(dateData.month);
  datayear = parseInt(dateData.year);
  return new Promise(async (resolve, reject) => {
    let orders = await db
      .get()
      .collection(collection.ORDER_COLLECTION)
      .aggregate([
        {
          $match: {
            status: "Success",
          },
        },
        {
          $addFields: {
            day: {
              $dayOfMonth: {
                $dateFromString: {
                  dateString: "$Order_date",
                },
              },
            },
            month: {
              $month: {
                $dateFromString: {
                  dateString: "$Order_date",
                },
              },
            },
            year: {
              $year: {
                $dateFromString: {
                  dateString: "$Order_date",
                },
              },
            },
          },
        },
        {
          $match: { month: datamonth, year: datayear },
        },
        {
          $unwind: "$products",
        },
        {
          $group: {
            _id: "$Order_date",
            quantity: { $sum: "$products.quantity" },
            total: { $sum: "$products.stotal" },
          },
        },
      ])
      .toArray();
    resolve(orders);
    });
  },
getSalesByyear: (dateData) => {
  datayear = parseInt(dateData.yearly);
  return new Promise(async (resolve, reject) => {
    let orders = await db
      .get()
      .collection(collection.ORDER_COLLECTION)
      .aggregate([
        {
          $match: {
            status: "Success",
          },
        },
        {
          $addFields: {
            month: {
              $month: {
                $dateFromString: {
                  dateString: "$Order_date",
                },
              },
            },
            year: {
              $year: {
                $dateFromString: {
                  dateString: "$Order_date",
                },
              },
            },
          },
        },
        {
          $match: { year: datayear },
        },
        {
          $unwind: "$products",
        },
        {
          $group: {
            _id: "$month",
            quantity: { $sum: "$products.quantity" },
            total: { $sum: "$products.stotal" },
          },
        },
      ])
      .toArray();
    resolve(orders);
    });
  },
totalsaleAmount: () => {
  return new Promise(async (resolve, reject) => {
    let totalsale = await db
      .get()
      .collection(collection.ORDER_COLLECTION)
      .aggregate([{ $group: { _id: null, sum: { $sum: "$totalAmount.total" } } }])
      .toArray();
      
    resolve(totalsale);
  });
},
totalsales:()=>{
  return new Promise(async(resolve,reject)=>{
    let totalsales= await db.get().collection(collection.ORDER_COLLECTION).find(
      {
        status:"Success"
      }
    ).toArray()
    resolve(totalsales)
  })
},
totalcustomer:()=>{
  return new Promise(async(resolve,reject)=>{
    let customercount= await db.get().collection(collection.USERS_COLLECTION).find().toArray()
    resolve(customercount)
  })
}
}
