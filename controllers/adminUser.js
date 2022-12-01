const adminHelpers = require("../helpers/admin-helpers");

module.exports={
    /* user add */
    add:(req, res) => {
        res.render('admin/addUser')
      },
    addPost:(req, res) => {
        console.log(req.body);
        adminHelpers.addUsers(req.body).then((response) => {
          res.redirect('/admin/users')
        })
      },
      /* display users */
      listAll:(req, res) => {
        adminHelpers.getAllUsers().then((users) => {
          res.render('admin/userpanel', { users })
        })
      },
      /* block-user */
      block:(req, res) => {
        adminHelpers.blockUser(req.params.id).then(() => {
          res.redirect('/admin/users')
        })
      },
      /* unblock-user */
      unblock:(req, res) => {
        adminHelpers.unblockUser(req.params.id).then(() => {
          res.redirect('/admin/users')
        })
      }
}