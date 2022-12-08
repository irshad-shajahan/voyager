const adminHelpers = require("../helpers/admin-helpers");

module.exports={
    banners:async(req,res)=>{
       await adminHelpers.banners().then((banners)=>{
            
            res.render('admin/banners',{banners})
        })
    },
    add:(req,res)=>{
        res.render('admin/addBanners')
    },
    addPost:async(req,res)=>{
        bannerData=req.body
        let imagesFileNames=req.files.map((file)=>{
            return file.filename
          })
          bannerData.images=imagesFileNames
          bannerid=await adminHelpers.bannerAdd((bannerData))
        res.redirect('/admin/banners')
    },
    delete:(req,res)=>{
        adminHelpers.deletebanner(req.params.id).then((response)=>{
            res.json(response)
        })
    },
    status:(req,res)=>{
        if(req.body.status=="true"){
            req.body.status=true
        }else{
            req.body.status=false
        }
        adminHelpers.banstatus(req.body).then((response)=>{
            res.json({status:true})
        })
    }
}