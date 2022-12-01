const adminHelpers = require("../helpers/admin-helpers")

const admindm = process.env.ADMIN
const passworddm = process.env.PASSWORD
module.exports={
    /* render admin homepage */
    home:async(req, res) => {
      let report = await adminHelpers.dailysale()
        let revenue=await adminHelpers.totalsaleAmount()
        let sales=await adminHelpers.totalsales()
        salescount=sales.length
        let customers=await adminHelpers.totalcustomer()
        customercount=customers.length
        console.log(customercount);
        res.render('admin/index',{report,revenue,salescount,customercount})
      },
      /* admin login */
      login:function (req, res, next) {
        res.render('admin/adminlogin')
      },
      loginPost:(req, res) => {
        const { admin, password } = req.body
        if (admin === admindm && password === passworddm) {
          req.session.login = true
          res.redirect("/admin/index")
        } else {
          res.redirect("/admin")
        }
      },
      /* admin logout */
      logout:(req, res) => {
        req.session.login = null
        res.redirect('/admin')
      },
      linegraph:async (req, res) => {
        value = await adminHelpers.amount();
        const name = value.map(function filename(file) {
          return file._id;
        });
      
        const data = value.map((file) => {
          return file.Total;
        });
        res.json({
          name,
          data,
        });
      },
      pieData:async(req,res)=>{
        value = await adminHelpers.chartPayment();
        const name = value.map(function filename(file) {
          return file._id;
        });
      
        const data = value.map((file) => {
          return file.Total;
        });
      
        res.json({
          name,
          data,
        });
      },
      
      yearly:async (req, res) => {
        let year = await adminHelpers.getYearly();
        var orderCounts = Array(12).fill(0);
        for (let date of year) {
          orderCounts[date._id.month - 1] = date.Total;
        }
        res.json({ orderCounts });
      },
      
}