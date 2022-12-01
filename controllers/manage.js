const cartHelpers = require("../helpers/cart-helpers");
const userHelpers = require("../helpers/user-helpers");
const useracct = require("../helpers/useracct");

module.exports = {
  userpage: async (req, res) => {
    user=req.session.user
    // console.log(user);
    if(req.session.user){
      cartCount=await cartHelpers.getCartCount(req.session.user._id)
    }
    detail = await useracct.getuser(req.session.user._id)
    req.session.user=detail
    user=req.session.user
    res.render("user/myprofile", { detail, user , cartCount });
  },
  updateuser: (req, res) => {
    console.log('update user called');
    useracct.updateuser(req.body, req.session.user._id).then(() => {
      res.json({ status: true });  
    });
  },
  changepassword: (req, res) => {
    useracct
      .password(req.session.user._id, req.body)
      .then(() => {
        res.json({ status: true });
      })
      .catch(() => {
        res.json({ status: false });
      });
  },
  address:async(req,res)=>{
    if(req.session.user){
      cartCount=await cartHelpers.getCartCount(req.session.user._id)
    }
    detail = await useracct.getuser(req.session.user._id)
    req.session.user=detail
    let address=req.session.user.Address
    res.render("user/manageAddress",{user,cartCount,address})
  },
  addressDelete:(req,res)=>{
    console.log(req.query.phn);
    userHelpers.deleteAddress(req.session.user._id,req.query.phn).then(()=>{
    res.redirect('/manageaddress')
    })
  },
  addressAdd:(req,res)=>{
    console.log(req.body);

    userHelpers.addNewAddress(req.body).then(()=>{
      res.redirect('/manageaddress')
    })
  },
  wallet:async(req,res)=>{

    if(req.session.user){
      user=req.session.user
      cartCount=await cartHelpers.getCartCount(req.session.user._id)
    }
    history=req.wallet
  wallet= await userHelpers.wallet(user._id)
    if(wallet){
      Amount=wallet.Amount
    }else{
     Amount=0
    }
   console.log(history);
      res.render('user/wallet',{cartCount,user,Amount,history})
    
  }
};
