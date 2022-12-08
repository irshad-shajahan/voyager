const cartHelpers = require("../helpers/cart-helpers");
const orderHelpers = require("../helpers/order-helper");
const paypalhelpers = require("../helpers/paypal");

module.exports = {
  place: async (req, res) => {
    let products = await cartHelpers.getCartProducts(req.body.userId);
    var totalPrice = await cartHelpers.getTotalAmount(req.body.userId);
    req.body.code = "No Coupon Applied"
    prodisc=0
    if (req.session.coupon) {
      totalPrice.total = req.session.newtot;
      req.body.code = req.session.coupon.Coupon_Code;
      prodisc=req.session.prodisc
    }
    products.forEach((element) => {
      element.stotal=element.stotal-prodisc
      element.orderStatus = "Placed";
    });
    orderHelpers
      .placeOrder(req.body, products, totalPrice)
      .then(async (orderId) => {
        if (req.body["paymentMethod"] == "COD") {
          res.json({ codSuccess: true });
        } else if (req.body["paymentMethod"] == "Razorpay") {
          orderHelpers
            .generateRazorpay(orderId.insertedId, totalPrice)
            .then((response) => {
              response.razorpay = true;
              res.json(response);
            });
        } else if (req.body["paymentMethod"] == "paypal") {
          let items = await paypalhelpers.items(req.session.user._id);
          total = items.reduce(function (accumulator, items) {
            return accumulator + items.price * items.quantity;
          }, 0);
          req.session.total = total;
          paypalhelpers.createorder(items, total).then((payment) => {
            for (let i = 0; i < payment.links.length; i++) {
              if (payment.links[i].rel === "approval_url") {
                res.json(payment.links[i].href);
              }
            }
          });
        }else {
          orderHelpers.walletPayment(orderId.insertedId,req.session.user._id,totalPrice.total).then((response)=>{

            res.json({ wallet: response })
          })

        }
      });
  },
  // 
  orders: async (req, res) => {
    if (req.session.user) {
      cartCount = await cartHelpers.getCartCount(req.session.user._id);
    }
    let pageNos=req.pag
    user = req.session.user;
    let orders=req.order
    let previous=res.prevpage
    let next=res.next
    let cpage=req.current
      for (i = 0; i < orders.length; i++) {
        if (orders[i].status == "Success") {
          orders[i].Now = true;
        } else {
          orders[i].Now = false;
        }
      }
      if(orders.length>0){
        present=true
      }else{
        present=false
      }
      for(i=0; i<orders.length; i++){
        for(j=0; j<orders[i].products.length;j++){
          if (orders[i].products[j].orderStatus == "Placed") {
            orders[i].products[j].pstat = true;
          } else if(orders[i].products[j].orderStatus == "Shipped"){
            orders[i].products[j].pstat = false;
            orders[i].products[j].ship = true;
          }else if(orders[i].products[j].orderStatus== "Out For Delivery"){
            orders[i].products[j].pstat = false;
            orders[i].products[j].ship = false;
            orders[i].products[j].out = true;
          }
          else if(orders[i].products[j].orderStatus== "Delivered"){
            orders[i].products[j].out = false;
            orders[i].products[j].pstat = false;
            orders[i].products[j].ship = false;
            orders[i].products[j].del = true;
          }else if(orders[i].products[j].orderStatus== "Return Requested"){
            orders[i].products[j].out = false;
            orders[i].products[j].pstat = false;
            orders[i].products[j].ship = false;
            orders[i].products[j].del = false;
            orders[i].products[j].ret = true;
          }
          else{
            orders[i].products[j].out = false;
            orders[i].products[j].pstat = false;
            orders[i].products[j].ship = false;
            orders[i].products[j].del = false;
            orders[i].products[j].ret = false;
          }
        }
      }
      if(!cpage){
        cpage=1
      }
      pageNos.forEach((element)=>{
        if((element.page==cpage))
        element.active="bg-warning"
      })

      req.session.orderdate = orders.Order_date;
      res.render("user/orders", { user, orders, cartCount, present, pageNos, previous, next });
    
  },

  updateOrderStatusAdmin: (req, res) => {
    orderHelpers.updateOrderAdmin(req.body).then((response) => {
      res.json(response)
    });
  },
  adminViewOrder: (req, res) => {
    orderHelpers.getadminOrderProducts().then((orders) => {
      for (i = 0; i < orders.length; i++) {
        if (orders[i].status == "Success") {
          orders[i].Now = true;
        } else {
          orders[i].Now = false;
        }
      }

      for(i=0; i<orders.length; i++){
        for(j=0; j<orders[i].products.length;j++){
          if (orders[i].products[j].orderStatus == "Placed") {
            orders[i].products[j].pstat = true;
          } else if(orders[i].products[j].orderStatus == "Shipped"){
            orders[i].products[j].pstat = false;
            orders[i].products[j].ship = true;
          }else if(orders[i].products[j].orderStatus== "Out For Delivery"){
            orders[i].products[j].pstat = false;
            orders[i].products[j].ship = false;
            orders[i].products[j].out = true;
          }
          else if(orders[i].products[j].orderStatus== "Delivered"){
            orders[i].products[j].out = false;
            orders[i].products[j].pstat = false;
            orders[i].products[j].ship = false;
            orders[i].products[j].del = true;
          }else if(orders[i].products[j].orderStatus== "Return Requested"){
            orders[i].products[j].out = false;
            orders[i].products[j].pstat = false;
            orders[i].products[j].ship = false;
            orders[i].products[j].del = false;
            orders[i].products[j].ret = true;
          }
          else{
            orders[i].products[j].out = false;
            orders[i].products[j].pstat = false;
            orders[i].products[j].ship = false;
            orders[i].products[j].del = false;
            orders[i].products[j].ret = false;
          }
        }
      }

      res.render("admin/orders", { orders });
    });
  },
  viewProduct: async (req, res) => {
    user = req.session.user;
    if (req.session.user) {
      cartCount = await cartHelpers.getCartCount(req.session.user._id);
    }
    let products = await orderHelpers.getOrderProducts(req.params.id);


    res.render("user/viewOrderProducts", { user, products, cartCount });
  },
  updateOrderStatusUser: (req, res) => {
    refundAmount=parseInt(req.body.refundAmount)
    orderHelpers.updateOrderUser(req.body.order,req.body.product,req.body.action,req.session.user._id,refundAmount).then((response) => {
      res.json(response)
    });
  },
  history: async (req, res) => {
    if (req.session.user) {
      cartCount = await cartHelpers.getCartCount(req.session.user._id);
    }
    user = req.session.user;
    let orders = await orderHelpers.getUserOrders(req.session.user._id);
    res.render("user/orderhistory", { user, orders, cartCount });
  },
  verifyPayment: (req, res) => {
    orderHelpers
      .verifyPayment(req.body)
      .then(() => {
        orderHelpers
          .changePaymentStatus(req.body["order[receipt]"])
          .then(() => {
            res.json({ status: true });
          });
      })
      .catch((err) => {
        res.json({ status: false, errMsg: "" });
      });
  },
  verifyPaypal: (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
    paypalhelpers.verify(payerId, paymentId, req.session.total).then(() => {
      orderHelpers.changePaymentStatus(req.session.orderId,req.session.user._id).then((response) => {
        res.redirect("/ordersucess");

      });
    });
  },
  papusuccess: async(req, res) => {
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
    res.render("user/paypalsuccess",{user,cartCount,address});
  },
};
