const adminHelpers = require("../helpers/admin-helpers")

module.exports={
    daily:async(req,res)=>{
        let report = await adminHelpers.dailysale()
        console.log(report);
        res.render('admin/dailysales',{report})
    },
    
    weekly:async(req,res)=>{
        let report = await adminHelpers.weeklySale()
        console.log(report);
        res.render('admin/weeklysales',{report})
    },

   
    salesReport: async (req, res) => {
        let report = await adminHelpers.AnnualSale();
        res.render("admin/salesReport", { report });
      },
    fromTo: (req, res) => {
        date = req.query;
        adminHelpers.fromTo(date).then((Data) => {
          res.render("admin/salesReport", { Data, date });
        });
      },
    monthly:(req, res) => {
        let cdate = req.query;
        let vals = cdate.month.split("-");
        dates = {
          month: vals[1],
          year: vals[0],
        };
        adminHelpers.getSalesByMonth(dates).then((Data) => {
          res.render("admin/adminMonthly", { Data, cdate });
        });
      },
    yearlySales:(req, res) => {
        const month = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        let cyear = req.query;
        adminHelpers.getSalesByyear(cyear).then((Data) => {
          Data.forEach((element) => {
            element._id = month[element._id - 1];
          });
          res.render("admin/adminMonthly", { Data, cyear });
        });
      },
    

}