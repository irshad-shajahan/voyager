const userHelpers = require("../helpers/user-helpers")
const accountsID=process.env.ACCOUNTSID
const authToken=process.env.AUTHTOKEN
const serviceID=process.env.SERVICEID
const client = require("twilio")(accountsID, authToken)
const { Client } = require('twilio/lib/twiml/VoiceResponse');
const twilio = require('twilio'); 
require('dotenv').config()     



                                     
module.exports={
    /* otp sending */
    otp:(req, res) => {
        otpmsg = req.session.otp
        res.render('user/otplogin', { otpmsg })
        req.session.otp = null
      },
      send:(req, res) => {
        userHelpers.doOTP(req.body.Phone).then((response) => {
          if (response.status) {
            req.session.mobile = req.body.Phone
            console.log(req.body.Phone);
            client
              .verify
              .services(serviceID)
              .verifications
              .create({
                to: `+91${req.body.Phone}`,
                channel: "sms"
              }).then((data) => {
                console.log(data);
                res.redirect('/verify')
              })
          } else {
            if (response.blockotp) {
              req.session.otp = "The Phone Number Is Blocked"
              res.redirect('/sendotp')
            } else {
              req.session.otp = "The Phone Number Is Not Registered"
              res.redirect('/sendotp')
            }
          }
        })
      },
      /* otp verification */
      enter:(req, res) => {
        res.render('user/otpverify', { phone: req.session.mobile })
      },
      verify:(req, res) => {
        userHelpers.doOTP(req.session.mobile).then((response) => {
          req.session.user = response
          req.session.userlogin = true
          var arr = Object.values(req.body)
          var otp = arr.toString().replaceAll(',', '');
          console.log(otp);
          client
            .verify
            .services(serviceID)
            .verificationChecks
            .create({
              to: `+91${req.session.mobile}`,
              code: otp
            }).then((data) => {
              if (data.valid) {
                console.log(data);
                res.redirect('/')
              } else {
                res.redirect('/verify')
              }
            })
        })
      }
}