const userHelpers = require("../helpers/user-helpers");
const cartHelpers = require("../helpers/cart-helpers");

module.exports = {
  /* cart page render */
  cart: async (req, res) => {
    let cartCount = null;
    req.session.coupon = null;
    if (req.session.user) {
      cartCount = await cartHelpers.getCartCount(req.session.user._id);
    }
    let products = await cartHelpers.getCartProducts(req.session.user._id);
    if (products.length == 0) {
      products.empty = true;
    }
    let total = await cartHelpers.getTotalAmount(req.session.user._id);
    let user = req.session.user;
    res.render("user/usercart", { user, products, cartCount, total });
  },
  /* add to cart */
  add: async (req, res) => {
    let stockcheck = await cartHelpers.stock(req.params.id);
    if (stockcheck == 0) {
      res.json({stock:true})
    } else {
      if (req.session.user) {
        cartHelpers.stockdecrement(req.params.id).then(async()=>{
          await cartHelpers
            .addToCart(req.params.id, req.session.user._id)
            .then((response) => {
              res.json({ status: true });
            });
        })
      } else {
        res.json({ login: true });
      }
    }
  },
  qty: (req, res, next) => {
    cartHelpers
      .changeProductQuantity(req.body)
      .then((response) => {
        res.json(response);
      })
      .catch(() => {
        res.json({ outofstock: true });
      });
  },
  /* remove from cart */
  checkout: async (req, res) => {
    let cartCount = null;
    if (req.session.user) {
      cartCount = await cartHelpers.getCartCount(req.session.user._id);
      userwallet = await userHelpers.wallet(req.session.user._id);
    }
    let id = req.session.user._id;
    let products = await cartHelpers.getCartProducts(id);
    let user = req.session.user;
    let totall = await cartHelpers.getTotalAmount(id);
    let address = await cartHelpers.selectAddress(id);
    coup = req.session.coupon;
    newTotal = totall.total;
    if (req.session.coupon) {
      if (newTotal >= coup.Min_Amount) {
        maxdiscount = (coup.Discount_Percentage * totall.total) / 100;
        if (maxdiscount <= coup.Max_Amount) {
          productsdiscount = maxdiscount / products.length;
          newTotal = totall.total - maxdiscount;
        } else {
          productsdiscount = coup.Max_Amount / products.length;
          newTotal = totall.total - coup.Max_Amount;
        }
        productsdiscount = Math.round(productsdiscount);
        req.session.prodisc = productsdiscount;
        newTotal = Math.round(newTotal);
        req.session.newtot = newTotal;
        products.forEach((element) => {
          element.stotal = element.stotal - productsdiscount;
        });
      }
    }

    res.render("user/checkout", {
      user,
      newTotal,
      products,
      cartCount,
      address,
      userwallet,
    });
  },
  removeProduct: (req, res) => {
    proId = req.params.id;
    cartHelpers.deleteitem(req.session.user._id, proId).then(() => {
      res.redirect("/usercart");
    });
  },
  addressAdd: (req, res) => {

    userHelpers.addNewAddress(req.body).then(() => {
      res.redirect("/proceed-checkout");
    });
  },
};
