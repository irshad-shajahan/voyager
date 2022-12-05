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
  .get(verify.verifyAdminLoggedOut,adminUser.add)
  .post(verify.verifyAdminLoggedOut,adminUser.addPost)

router
.route('/blockUser/:id')
.get(verify.verifyAdminLoggedOut,adminUser.block)

router
.route('/unblockUser/:id')
.get(verify.verifyAdminLoggedOut,adminUser.unblock)

/* Categories */
router
.route('/categories')
.get(verify.verifyAdminLoggedOut,cat.category)

// add-category
router
  .route('/addCategory')
  .get(verify.verifyAdminLoggedOut,cat.add)
  .post(verify.verifyAdminLoggedOut,cat.addPost)
  
// edit-category
router
  .route('/editCategory/:id')
  .get(verify.verifyAdminLoggedOut,cat.edit)
  .post(verify.verifyAdminLoggedOut,cat.editPost)

// delete-caetgory
router
.route('/deletecategory/:id')
.get(verify.verifyAdminLoggedOut,cat.delete)

/* Product */
router
.route('/products')
.get(verify.verifyAdminLoggedOut,product.list)

// add-product
router
  .route('/addproducts')
  .get(verify.verifyAdminLoggedOut,product.add)
  .post(verify.verifyAdminLoggedOut,upload.array('Image',4),product.addPost)

// delete-product
router
.route('/deleteProduct/:id')
.get(verify.verifyAdminLoggedOut,product.delete)

// edit-product
router
.route('/editProduct/:id')
  .get(verify.verifyAdminLoggedOut,product.edit)
  .post(verify.verifyAdminLoggedOut,upload.array('Image',4),product.editPost)



router
.route('/orders')
.get(verify.verifyAdminLoggedOut,order.adminViewOrder)

router
.route('/updateStatus')
.post(verify.verifyAdminLoggedOut,order.updateOrderStatusAdmin)

router
.route('/salesreport')
.get(verify.verifyAdminLoggedOut,sales.salesReport)

router
.route("/linegraph")
.get(verify.verifyAdminLoggedOut,adminHome.linegraph)


router
.route('/pieData')
.get(verify.verifyAdminLoggedOut,adminHome.pieData)

router
.route('/yearly')
.get(verify.verifyAdminLoggedOut,adminHome.yearly)

router
.route('/coupons')
.get(verify.verifyAdminLoggedOut,coupon.coupons)

router
.route('/addcoupons')
.get(verify.verifyAdminLoggedOut,coupon.add)
.post(verify.verifyAdminLoggedOut,coupon.addPost)

router
.route('/deletecoupon/:id')
.get(verify.verifyAdminLoggedOut,coupon.delete)

router
.route('/banners')
.get(verify.verifyAdminLoggedOut,banners.banners)

router
.route('/addBanner')
.get(verify.verifyAdminLoggedOut,banners.add)

router
.route('/banneradd')
.post(verify.verifyAdminLoggedOut,upload.array('Image',4),banners.addPost)

router
.route('/deletebanner/:id')
.get(verify.verifyAdminLoggedOut,banners.delete)

router
.route('/banstatus')
.post(verify.verifyAdminLoggedOut,banners.status)

router
.route('/fromto')
.get(verify.verifyAdminLoggedOut,sales.fromTo)

router
.route('/monthly')
.get(verify.verifyAdminLoggedOut,sales.monthly)

router
.route('/salesyearly')
.get(verify.verifyAdminLoggedOut,sales.yearlySales)

module.exports = router;
