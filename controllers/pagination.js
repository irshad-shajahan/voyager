const collection = require("../config/collection");
var db = require("../config/connection");
var express=require('express')
const orderHelpers = require("../helpers/order-helper");
const userHelpers = require("../helpers/user-helpers");

module.exports = {
    pagination: (req, res, next) => {
      user=req.session.user
      orderHelpers.deletePending(user._id).then(async() => {
            let uid = req.session.user._id;
            let pagenum = 1
            if (req.query.page) {
             pagenum =parseInt(req.query.page) 
            }
            let limit = 3;
            let firstindex = (pagenum - 1) * limit;
            let order = await  orderHelpers.getUserOrders(uid, firstindex, limit);
            let counnnt=await orderHelpers.getUserOrdersCount(uid)
            let count=counnnt.length
            let length = Math.ceil(count / 3);
            let prevpage
            if (pagenum > 1) {
                prevpage = {
                    page: pagenum - 1,
                    limit:3,
                }
                
            }
            let nextpage 
            if (pagenum < length) {
                nextpage = {
                    page: pagenum + 1,
                    limit: 3,
                  };
                }
            
            let paginationNum = [];
            for (i = 1; i <= length; i++){
                paginationNum.push({page:i})
            }
            res.next=nextpage
            res.prevpage=prevpage
            req.pag = paginationNum 
            req.order = order;
            req.current=req.query.page
            next();
        })
     
  
  },
wallet: async(req, res, next) => {
          user=req.session.user
          let userId = req.session.user._id;
          let pagenum = 1
          if (req.query.page) {
           pagenum =parseInt(req.query.page) 
          }
          let limit = 3;
          let firstindex = (pagenum - 1) * limit;
          let wallet= await userHelpers.wallethist(userId,firstindex,limit)
          let counnnt=await userHelpers.wallet(userId)
          let count=counnnt.length
          let length = Math.ceil(count / 3);
          let prevpage
          if (pagenum > 1) {
              prevpage = {
                  page: pagenum - 1,
                  limit:3,
              }
              
          }
          let nextpage 
          if (pagenum < length) {
              nextpage = {
                  page: pagenum + 1,
                  limit: 3,
                };
              }
          
          let paginationNum = [];
          for (i = 1; i <= length; i++){
              paginationNum.push({page:i})
          }
          res.next=nextpage
          res.prevpage=prevpage
          req.pag = paginationNum 
          req.wallet = wallet;
          req.current=req.query.page
          next();
      
     
  
  }
};
