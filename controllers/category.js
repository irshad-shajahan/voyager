const productHelpers = require("../helpers/product-helpers")

module.exports={
    /* category listing */
    category:(req, res) => {
        productHelpers.getAllCategory().then((category) => {
          res.render('admin/categories', { category })
        })
      },
      /* add category */
      add:(req, res) => {
        res.render('admin/addCategory')
      },
      addPost:(req, res) => {
        productHelpers.addCategory(req.body).then((response) => {
          res.redirect('/admin/categories')
        })
      },
     /* edit category */
     edit:async (req, res) => {
        let cat = await productHelpers.getCategoryDetails(req.params.id)
        res.render('admin/editCategory', { cat })
      },
      editPost:(req, res) => {
        productHelpers.updateCategory(req.params.id, req.body).then(() => {
        })
        res.redirect('/admin/categories')
      },
      /* delete-category */
      delete:(req, res) => {
        productHelpers.deleteCategory(req.params.id).then((response) => {
          res.redirect('/admin/categories')
        })
      }
}