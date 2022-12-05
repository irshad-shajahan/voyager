var express = require('express');
var router = express.Router();
const home =require('../controllers/userHome')
const verify=require('../controllers/sessHandle');
const userhome = require('../controllers/userHome');
const otp=require('../controllers/otp');
const products = require('../controllers/products');
const cart = require('../controllers/cart');
const order = require('../controllers/order');
const manage=require('../controllers/manage');
const { get } = require('./admin');
const wish=require('../controllers/wish')
const coupon=require('../controllers/coupons');
const { verifyLoggedOutUser } = require('../controllers/sessHandle');
const sessHandle = require('../controllers/sessHandle');
const { page } = require('../controllers/pagination');
const pagination = require('../controllers/pagination');
module.exports = router;
/* render user home */
router.get('/',home.home);

/* user-login */
router
  .route('/login')
  .get(home.userlogin)
  .post(home.userloginverify)

/* user-signup */
router
  .route('/signup')
  .get(userhome.signup)
  .post(userhome.signupPost)

/* user-logout */
router.get('/logout',userhome.logout)

/* otp-login */
router
  .route('/sendotp')
  .get(otp.otp)
  .post(otp.send)

router
  .route('/verify')
  .get(otp.enter)
  .post(otp.verify)
  
/* user-page product-display */
router
.route('/productDetails/:id')
.get(sessHandle.ogUrl,products.userproductdetails)

/* usercart */
router
.route('/usercart')
.get(verify.verifyLoggedOutUser,cart.cart)

router
.route('/addtocart/:id')
.get(verify.verifyLoggedOutUser,cart.add)


router
.route('/change-product-quantity')
.post(verify.verifyLoggedOutUser,cart.qty)

router
.route('/removeProduct/:id')
.get(verify.verifyLoggedOutUser,cart.removeProduct)

router
.route('/proceed-checkout')
.get(verify.verifyLoggedOutUser,cart.checkout)

router
.route('/place-order')
.post(verify.verifyLoggedOutUser,order.place)

router
.route('/orders')
.get(verify.verifyLoggedOutUser,pagination.pagination,order.orders)

router
.route('/view-order-details/:id')
.get(verify.verifyLoggedOutUser,order.viewProduct)

router
.route('/updateOrderUser')
.post(verify.verifyLoggedOutUser,order.updateOrderStatusUser)

router
.route('/orderhistory')
.get(verify.verifyLoggedOutUser,order.history)

router
.route('/userprofile')
.get(verify.verifyLoggedOutUser,manage.userpage)

router
.route('/updateuser')
.post(verify.verifyLoggedOutUser,manage.updateuser)

router
.route('/verify-payment')
.post(order.verifyPayment)

router
.route('/manageaddress')
.get(verify.verifyLoggedOutUser,manage.address)
.post(manage.addressAdd)


router
.route('/verifyPaypal')
.get(order.verifyPaypal)

router
.route('/changePassword')
.post(manage.changepassword)

router
.route('/userwishlist')
.get(verify.verifyLoggedOutUser,wish.wishlist)

router
.route('/delete_address')
.get(manage.addressDelete)

router
.route('/checkoutadd')
.post(verify.verifyLoggedOutUser,cart.addressAdd)

router
.route('/wallet')
.get(verify.verifyLoggedOutUser,pagination.wallet,manage.wallet)

router
.route('/apply-coupon')
.post(coupon.apply)

router
.route('/ordersucess')
.get(order.papusuccess)

router
.route('/shop')
.get(sessHandle.ogUrl,userhome.shop)

router
.route('/addtowishlist/:id')
.get(wish.addWish)

router
.route('/removeWish/:id')
.get(wish.remove)