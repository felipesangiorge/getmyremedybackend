const con = require('../../config/database')


function getLoginUser(req,res){
  return con.queryFunction(`SELECT * FROM tb_users WHERE des_mail like "${req.user_mail}" AND des_password like "${req.user_password}" ` ,res)
}


module.exports = {getLoginUser}