const con = require('../../config/database')


function getVerifyIfUserExists(req,res){
  return con.queryFunction(`SELECT * FROM tb_users WHERE des_mail like '${req}'`,res)
}
function getUser(req,res) {
  return con.queryGet(`SELECT * FROM tb_users WHERE des_mail like '${req}'`,res)
}

function setEditUser(req,password,res){
  return con.queryFunction(`UPDATE tb_users SET     des_address='${req.des_address}',
                                                    des_state='${req.des_state}',
                                                    des_city='${req.des_city}',
                                                    num_cep=${req.num_cep},
                                                    num_phone=${req.num_phone},
                                                    des_password='${password}' WHERE des_mail like '${req.des_mail}'` ,res)
}


module.exports = {setEditUser,getVerifyIfUserExists,getUser}
