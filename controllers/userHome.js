const adminHelpers = require("../helpers/admin-helpers");
const cartHelpers = require("../helpers/cart-helpers");
const productHelpers = require("../helpers/product-helpers");
const userHelpers = require("../helpers/user-helpers");


module.exports = {

/* userhome render */
  home: async function(req, res, next) {
    let user = req.session.user;
    let cartCount=null
    if(req.session.user){
     wishCount=await cartHelpers.getWishCount(req.session.user._id)
      cartCount=await cartHelpers.getCartCount(req.session.user._id)
      address=cartHelpers.selectAddress(req.session.user._id)
    }else{
      cartCount=0
      wishCount=0
    }
    let banner=await adminHelpers.bannershome()
    productHelpers.getAllproductsShop().then((products) => {
      products.forEach((elem)=>{
      if(elem.stock==0){
        elem.nostock=true
      }else{
        elem.nostock=false
      }
     })
      res.render("user/homepage", { user, products, cartCount,wishCount,banner});
    });
  },

/* user login */
  userlogin:(req, res, next) => {
    if (req.session.userlogin) {
      res.redirect('/')
    } else {
      let msg = req.session.msg
      res.render('user/userlogin', { msg })
      req.session.msg = null
    }
  },
  userloginverify:(req, res,next) => {
    userHelpers.doLogin(req.body).then((response) => {
      if (response.status) {
        req.session.user = response
        req.session.userlogin = true
        let redirect=(req.session.returnToUrl || '/')
        res.redirect(redirect)
      } else {
        if (response.msg) {
          req.session.msg = "Incorrect Password"
        } else {
          req.session.msg = "You have been blocked"
        } res.redirect('/login')
      }
    })
  },
 /*  userside signup */
 signup:(req, res, next) => {
  sgn = req.session.err
  if (req.session.userlogin) {
    res.redirect('/')
  } else {
    res.render('user/sIgnup', { sgn });
    req.session.err = null
  }
},
signupPost:(req, res) => {
  userHelpers.doSignup(req.body).then((response) => {
    if (response.Email || response.Phone) {
      req.session.err = "The email or phone already exist"
      res.redirect('/signup')
    } else {
      res.redirect('/login')
    }
  })
},
/* logout */
logout:(req, res) => {
  req.session.returnToUrl=null
  req.session.userlogin = null
  req.session.user = null
  res.redirect('/')
},
shop:async(req,res)=>{
  let user = req.session.user;
    let cartCount=null
    if(req.session.user){
      wishCount=await cartHelpers.getWishCount(req.session.user._id)
      cartCount=await cartHelpers.getCartCount(req.session.user._id)
      address=cartHelpers.selectAddress(req.session.user._id)
    }else{
      cartCount=0
      wishCount=0
    }
    productHelpers.getAllproducts().then((products)=>{

      res.render('user/shop',{user,cartCount,products,wishCount})
    })
}
} 