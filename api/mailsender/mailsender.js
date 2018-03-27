const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: 'mail.getmyremedy.com.br',
  port: 465,
  secure: true,
  auth:{
         user:"no-reply@getmyremedy.com.br",
         pass:"jy6QonwC-Xaj"
    },
    tls: {rejectUnauthorized:false}
})

function sendMail(mailOptions) {
  console.log(mailOptions)
  transporter.sendMail(mailOptions, function (error,info) {
   if(error){
     console.log("Error no envio: "+error)
   }else{
     console.log('Email enviado:'+info.response)
   }

 })
}


module.exports = {sendMail}
