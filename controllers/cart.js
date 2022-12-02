const userHelpers = require("../helpers/user-helpers");
const cartHelpers=require("../helpers/cart-helpers")

module.exports={
    /* cart page render */
    cart:async(req,res)=>{
      let cartCount=null
      req.session.coupon=null
    if(req.session.user){
      cartCount=await cartHelpers.getCartCount(req.session.user._id)
    }
      let products=await cartHelpers.getCartProducts(req.session.user._id)
      if(products.length==0){
        products.empty=true
      }
      let total=await cartHelpers.getTotalAmount(req.session.user._id)
        let user = req.session.user
        res.render('user/usercart',{user,products,cartCount,total})
      },
      /* add to cart */
      add:async(req,res)=>{
       await cartHelpers.addToCart(req.params.id,req.session.user._id).then((response)=>{
          res.json({status:true})
        })
      },
      qty: (req,res,next)=>{
        console.log(req.body);
        cartHelpers.changeProductQuantity(req.body).then((response)=>{
          res.json(response)
        })
      },
      /* remove from cart */
      checkout: async(req,res)=>{
        let cartCount=null
    if(req.session.user){
      cartCount=await cartHelpers.getCartCount(req.session.user._id)
       userwallet=await userHelpers.wallet(req.session.user._id)
    }
        let user = req.session.user
        let id=req.session.user._id
        let products=await cartHelpers.getCartProducts(id)
        let totall=await cartHelpers.getTotalAmount(id)
        let address = await cartHelpers.selectAddress(id)
        coup=req.session.coupon
        console.log('The coupon stored in session:'+coup);
        console.log('Grand total:'+totall.total)
        console.log('products passed'+products[0].stotal);
        newTotal=totall.total
        if(req.session.coupon){
        if(newTotal>=coup.Min_Amount){
          maxdiscount=(coup.Discount_Percentage*totall.total)/100
          console.log('maxdisc'+maxdiscount);
          if(maxdiscount<=coup.Max_Amount){
            productsdiscount=(maxdiscount/products.length)
            newTotal=totall.total-maxdiscount
          }else{
            productsdiscount=(coup.Max_Amount/products.length)
            newTotal=totall.total-coup.Max_Amount
          }
          productsdiscount=Math.round(productsdiscount)
          req.session.prodisc=productsdiscount
          newTotal=Math.round(newTotal)
          req.session.newtot=newTotal
          console.log('session of tot:'+req.session.newtot);
          products.forEach((element)=>{
            element.stotal=element.stotal-productsdiscount
          })
        }
        }
       
        console.log('newtotal'+newTotal);
        res.render('user/checkout',{user,newTotal,products,cartCount,address,userwallet})
      },
      removeProduct:(req,res)=>{
        proId=req.params.id
        console.log(req.session.user._id);
        cartHelpers.deleteitem(req.session.user._id,proId).then(()=>{
          res.redirect("/usercart")
        })
      },
      addressAdd:(req,res)=>{
        console.log(req.body);
    
        userHelpers.addNewAddress(req.body).then(()=>{
          res.redirect('/proceed-checkout')
        })
      },
      
}