var db = require("../config/connection");
var collection = require("../config/collection");
const { ObjectId } = require("mongodb");


module.exports = {
  addProduct: (product) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.PRODUCT_COLLECTION)
        .insertOne(product)
        .then((data) => {
          resolve(data);
        });
    });
  },
  getAllproducts: () => {
    return new Promise(async (resolve, reject) => {
      let products = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find()
        .toArray();
      resolve(products);
    });
  },
  getAllproductsShop: () => {
    return new Promise(async (resolve, reject) => {
      let products = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find().limit(8)
        .toArray();
      resolve(products);
    });
  },

  addCategory: (category) => {
    return new Promise(async (resolve, reject) => {
      cat={
        Category:category.Category,
        Offer:parseInt(category.Offer)
      }
      db.get()
        .collection(collection.CATEGORY_COLLECTION)
        .insertOne(cat)
        .then((data) => {
          resolve(data);
        });
    });
  },
  getAllCategory: () => {
    return new Promise(async (resolve, reject) => {
      let category = await db
        .get()
        .collection(collection.CATEGORY_COLLECTION)
        .find()
        .toArray();
      resolve(category);
    });
  },
  getCategoryDetails: (categoryid) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CATEGORY_COLLECTION)
        .findOne({ _id: ObjectId(categoryid) })
        .then((response) => {
          resolve(response);
        });
    });
  },
  updateCategory: (categoryid, categorydetails) => {
    let offer=parseInt(categorydetails.Offer)
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CATEGORY_COLLECTION)
        .updateOne(
          { _id: ObjectId(categoryid) },
          {
            $set: {
              Category: categorydetails.Category,
              Offer:parseInt(categorydetails.Offer)
            },
          }
        )
        .then(async() => {
          let check= await db.get().collection(collection.PRODUCT_COLLECTION).find({
            Category:categorydetails.Category
          }).toArray()
          console.log(check);
          if(check){
            console.log('check hsdbfsdbfkbsadhbfsa');
            let product= await db.get().collection(collection.PRODUCT_COLLECTION).find({
              Category:categorydetails.Category
            }).toArray()
            console.log(product);
            product.forEach(async(element)=>{
              disc=Math.round((offer*element.Price)/100)
              element.APrice=parseInt(element.APrice)
              element.Price=element.Price-disc
              let data= await db.get().collection(collection.PRODUCT_COLLECTION).updateOne(
                {
                  Category:categorydetails.Category,
                  _id:ObjectId(element._id)
                },
                {
                  $set:{
                    "Price":element.Price,
                    "categoryOffer":offer
                  }
                }
              )
              resolve()
            })
          }else{
            resolve()
          }
        });
    });
  },
  deleteCategory: (categoryid) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CATEGORY_COLLECTION)
        .deleteOne({ _id: ObjectId(categoryid) })
        .then((response) => {
          console.log("response from delete cat" + response);
          resolve(response);
        });
    });
  },
  deleteProduct: (Proid) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.PRODUCT_COLLECTION)
        .deleteOne({ _id: ObjectId(Proid) })
        .then((response) => {
          resolve(response);
        });
    });
  },
  getProductDetails: (Proid) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.PRODUCT_COLLECTION)
        .findOne({ _id: ObjectId(Proid) })
        .then((response) => {
          resolve(response);
        });
    });
  },
  updateProduct: (Proid, ProDetails) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.PRODUCT_COLLECTION)
        .updateOne(
          { _id: ObjectId(Proid) },
          {
            $set: {
              Name: ProDetails.Name,
              Brand: ProDetails.Brand,
              APrice:ProDetails.APrice,
              Category: ProDetails.Category,
              Price: ProDetails.Price,
              Poffer:ProDetails.Poffer,
              stock:ProDetails.stock,
              Description: ProDetails.Description,
              Updated_on: new Date(),
              images: ProDetails.imagesFileNames,
            },
          }
        )
        .then((response) => {
          resolve();
        });
    });
  },
  getCartExisting: (proId, userId) => {
    console.log(userId);
    return new Promise(async (resolve, reject) => {
        let check = {}
        let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({ user: ObjectId(userId) })
        console.log('usercart     ' + userCart);

        if (userCart) {
            let proInt = userCart.product.findIndex((product) => product.item == proId)
            console.log(proInt)
            if (proInt == -1) {
                check.status = true
                resolve(check)
            }
            else {
                check.status = false

                resolve(check)
            }

        } else {
            check.status = true
            resolve(check)
        }

      })

    },
};
