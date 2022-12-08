module.exports={
/* user session handling */
verifyLoggedInUser :(req, res, next) => {
    if (req.session.userlogin) {
      res.redirect('/')
    } else {
      next()
    }
  },
 verifyLoggedOutUser:(req, res, next) => {
  req.session.returnToUrl=req.originalUrl
    if (req.session.userlogin) {
      next()
    } else {
      res.redirect('/login')
    }
  },
  verifyAdminLoggedIn:(req, res, next) => {
    if (req.session.login) {
      res.redirect('/admin/index')
    } else {
      next()
    }
  },
  verifyAdminLoggedOut:(req, res, next) => {
    if (req.session.login) {
      next()
    } else {
      res.redirect('/admin')
    }
  },
  ogUrl:(req,res,next)=>{
    req.session.returnToUrl=req.originalUrl
  next()
  }
}
