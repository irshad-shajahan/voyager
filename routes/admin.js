var express = require('express');
var router = express.Router();
const adminHome = require('../controllers/adminHome');
const adminUser = require('../controllers/adminUser');
const verify=require('../controllers/sessHandle')
const cat=require('../controllers/category')
const product=require('../controllers/products')
const order=require('../controllers/order')
const upload=require('../controllers/multer')
const sales=require('../controllers/salesreport')
const coupon=require('../controllers/coupons');
const banners = require('../controllers/banners');

/* GET home page. */
router
.route('/index')
.get(verify.verifyAdminLoggedOut,adminHome.home)

/* admin login */
router
  .route('/')
  .get(verify.verifyAdminLoggedIn,adminHome.login)
  .post(adminHome.loginPost)
// !admin-logout
router
.route('/logout')
.get(adminHome.logout)

/* user-panel */
router
.route('/users')
.get(verify.verifyAdminLoggedOut,adminUser.listAll)

router
  .route('/AddUser')
  .get(adminUser.add)
  .post(adminUser.addPost)

router
.route('/blockUser/:id')
.get(adminUser.block)

router
.route('/unblockUser/:id')
.get(adminUser.unblock)

/* Categories */
router
.route('/categories')
.get(cat.category)

// add-category
router
  .route('/addCategory')
  .get(cat.add)
  .post(cat.addPost)
  
// edit-category
router
  .route('/editCategory/:id')
  .get(cat.edit)
  .post(cat.editPost)

// delete-caetgory
router
.route('/deletecategory/:id')
.get(cat.delete)

/* Product */
router
.route('/products')
.get(product.list)

// add-product
router
  .route('/addproducts')
  .get(product.add)
  .post(upload.array('Image',4),product.addPost)

// delete-product
router
.route('/deleteProduct/:id')
.get(product.delete)

// edit-product
router
.route('/editProduct/:id')
  .get(product.edit)
  .post(upload.array('Image',4),product.editPost)



router
.route('/orders')
.get(order.adminViewOrder)

router
.route('/updateStatus')
.post(order.updateOrderStatusAdmin)

router
.route('/salesreport')
.get(sales.salesReport)

// router
// .route("/weeklysales")
// .get(sales.weekly)

// router
// .route("/dailysales")
// .get(sales.daily)

// router
// .route("/monthlysales")
// .get(sales.monthly)


router
.route("/linegraph")
.get(adminHome.linegraph)


router
.route('/pieData')
.get(adminHome.pieData)

router
.route('/yearly')
.get(adminHome.yearly)

router
.route('/coupons')
.get(coupon.coupons)

router
.route('/addcoupons')
.get(coupon.add)
.post(coupon.addPost)

router
.route('/deletecoupon/:id')
.get(coupon.delete)

router
.route('/banners')
.get(banners.banners)

router
.route('/addBanner')
.get(banners.add)

router
.route('/banneradd')
.post(upload.array('Image',4),banners.addPost)

router
.route('/deletebanner/:id')
.get(banners.delete)

router
.route('/banstatus')
.post(banners.status)

router
.route('/fromto')
.get(sales.fromTo)

router
.route('/monthly')
.get(sales.monthly)

router
.route('/salesyearly')
.get(sales.yearlySales)

module.exports = router;
