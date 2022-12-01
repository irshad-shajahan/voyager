const adminHelpers = require("../helpers/admin-helpers");
const cartHelpers = require("../helpers/cart-helpers");

module.exports={
    coupons:async(req,res)=>{
        coups=await adminHelpers.coupons()
        console.log(coups);
        res.render('admin/coupons',{coups})
    },
    add:(req,res)=>{
        res.render('admin/addcoupons')
    },
    addPost:(req,res)=>{
        console.log(req.body);
    adminHelpers.couponAdd(req.body).then(()=>{
        res.redirect('/admin/coupons');
    })
    },
    delete:(req,res)=>{
        console.log(req.params);
        adminHelpers.deletecoupon(req.params).then(()=>{
            res.redirect('/admin/coupons')
        })
    },
    apply:(req,res)=>{
        console.log(req.body);
        cartHelpers.applycoupon(req.body).then((coupon)=>{
            coupon.valid=true
            let percnt=(coupon.Discount_Percentage/100)
            console.log(coupon);
            req.session.coupon=coupon
            res.json({coupon,percnt})
        }).catch(()=>{
            res.json({invalid:true})
        })
    }
}