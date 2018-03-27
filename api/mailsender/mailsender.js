const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service:'Gmail',
    auth:{
         user:"felipe.sangiorge@gmail.com",
         pass:"MinhaSenha"
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
