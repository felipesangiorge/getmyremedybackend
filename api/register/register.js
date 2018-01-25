const con = require('../../config/database')


function getVerifyIfUserExists(req,res){

  return con.queryFunction(`SELECT * FROM tb_users WHERE des_mail like '${req}'`,res)

}

function setRegisterNewUser(req,res){
  return con.queryFunction(`INSERT INTO tb_users   (nom_name,
                                                    des_address,
                                                    des_state,
                                                    des_city,
                                                    num_cep,
                                                    num_phone,
                                                    des_mail,
                                                    des_password)

                          VALUES ('${req.nom_name}',
                                  '${req.des_address}',
                                  '${req.des_state}',
                                  '${req.des_city}',
                                   ${req.num_cep},
                                   ${req.num_phone},
                                  '${req.des_mail}',
                                  '${req.des_password}')` ,res)
}


module.exports = {setRegisterNewUser,getVerifyIfUserExists}
