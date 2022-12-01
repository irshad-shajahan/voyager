const cartHelpers = require("../helpers/cart-helpers")
const productHelpers = require("../helpers/product-helpers")


module.exports={
  
    userproductdetails:async(req, res) => {
        req.session.path=req.params.id
        let user = req.session.user
        let cartCount=null
    if(req.session.user){
      cartCount=await cartHelpers.getCartCount(req.session.user._id)
      productHelpers.getCartExisting(req.params.id,user._id).then((check)=>{
        console.log('check');
        console.log(check);
        if(check){
          productHelpers.getProductDetails(req.params.id).then((products)=>{
          
            res.render('user/productDetails', { products, user, cartCount,check})
          })
        }else{

          productHelpers.getProductDetails(req.params.id).then((products)=>{
            
            res.render('user/productDetails', { products, user, cartCount})
          })
        }

      })
    }else{
      productHelpers.getProductDetails(req.params.id).then((products) => {
          let check={status:true}
        res.render('user/productDetails', { products, user, cartCount,check})
      })
    }
    
      
      },
      /* list-product-admin */
      list:async(req, res) => {
        await productHelpers.getAllproducts().then((products) => {
          res.render('admin/products', { products })
        })
      },
      /* add-product */
      add:(req, res) => {
        productHelpers.getAllCategory().then((category) => {
          res.render('admin/addProducts', { category })
    
        })
      },
      addPost:async(req, res) => {
        let productData=req.body
        console.log(productData);
        console.log(req.files);
        productData.added_on= new Date()
        let imagesFileNames=req.files.map((file)=>{
          return file.filename
        })
        productData.images=imagesFileNames
        console.log(productData);
        let proId= await productHelpers.addProduct((productData))
              res.redirect("/admin/products")

        
      },
      /* delete-product */
      delete:(req, res) => {
        productHelpers.deleteProduct(req.params.id).then((response) => {
          res.redirect('/admin/products')
        })
      },
      /* edit-product */
      edit:async (req, res) => {
        var products = await productHelpers.getProductDetails(req.params.id)
        var category = await productHelpers.getAllCategory()
        res.render('admin/editProduct', { products, category },)
      },
      editPost:async (req, res) => {
        console.log('dsdddddddddddddddd'+req.params.id);
        if(req.files[0]){
          var imageName=req.files.map((file)=>{
            return file.filename
          })
          var productData=req.body
          productData.imagesFileNames=imageName
        } 
        else {
          let value =await productHelpers.getProductDetails(req.params.id)
          var productData = req.body;
          console.log(req.body.id);
          console.log("havvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvi");
          console.log(value);
          productData.imagesFileNames = value.images
            console.log(productData);
        }
        // else{
        //   var productData=req.body
        //   productHelpers.getProductDetails(req.params.id).then((file)=>{
        //     productData.imagesFileNames=file.imagesFileNames
        //   })
        //   console.log(req.files);
        //   console.log(productData)
        // }
        productHelpers.updateProduct(req.params.id, productData).then((response) => {

          res.redirect("/admin/products")
        })
      }
}