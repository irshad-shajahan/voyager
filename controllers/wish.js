const cartHelpers = require("../helpers/cart-helpers")

module.exports={
    wishlist:async(req,res)=>{
        user=req.session.user
        let cartCount=null
    if(req.session.user){
      cartCount=await cartHelpers.getCartCount(req.session.user._id)
      wishCount=await cartHelpers.getWishCount(req.session.user._id)
    }
       cartHelpers.getWishProducts(user._id).then((wish)=>{
            res.render('user/userwishlist',{wish,user,cartCount,wishCount})
        })
    },
    addWish:(req,res)=>{
        user=req.session.user
        cartHelpers.addToWishList(req.params.id,user._id).then(()=>{
          res.json({status:true})
        })
      },
      remove:(req,res)=>{
        cartHelpers.removeWish(req.params.id,req.session.user._id).then((response)=>{
            res.redirect('/userwishlist')
        })

      }
}