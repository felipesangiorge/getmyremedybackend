const con = require('../../config/database')


function getRemedys(req,res){
  return con.queryGet('SELECT * FROM tb_remedys',res)
}

function getRemedysById(req,res){
  return con.queryFunction(`SELECT * FROM tb_remedys WHERE idtb_remedys = ${req}`,res)
}

function getRemedysByUser(req,res){
    return con.queryGet(`SELECT * FROM tb_remedys INNER JOIN tb_users ON tb_remedys.idtb_remedy_by_user = tb_users.idtb_users
                         WHERE idtb_remedy_by_user = ${req}`,res)
}

function deleteUserRemedy(req,res){
    return con.queryFunction(`DELETE FROM tb_remedys WHERE idtb_remedys = ${req} `,res)
}

function getRemedysMenu(req,res){
  return con.queryGet('SELECT * FROM tb_remedys_menu',res)
}

function getRemedysByMenuId(id,res){
    return con.queryGet(`SELECT * FROM tb_remedys_menu WHERE idtb_remedys_menu = ${id}`,res)
}

function getRemedysByMenuIdFunction(name,dosage,res){
    return con.queryFunction(`SELECT * FROM tb_remedys_menu WHERE des_name like "${name}" AND des_dosage like "${dosage}"`,res)
}

function getRemedysBySameName(id,res){
    return con.queryGet(`SELECT  tb_remedys.des_name,tb_remedys.des_validate ,tb_remedys.des_imagePath,
                        tb_users.nom_name, tb_users.des_city, tb_users.des_mail, tb_users.num_phone FROM tb_remedys_menu
                        INNER JOIN tb_remedys  ON tb_remedys.idfk_remedys_menu  = tb_remedys_menu.idtb_remedys_menu
                        INNER JOIN tb_users ON tb_remedys.idtb_remedy_by_user = tb_users.idtb_users
                        WHERE tb_remedys.idfk_remedys_menu = ${id}`,res)
}

function verifyUserRemedyId(idtb_remedy_by_user,cb){
  return con.queryFunction(`SELECT idtb_users FROM tb_users WHERE des_mail like "${idtb_remedy_by_user}"`,cb)
}

function setRemedyMenuByParams(req,res) {
  return con.queryFunction(`INSERT INTO tb_remedys_menu          (des_name,
                                                          des_dosage,
                                                          des_category,
                                                          des_description,
                                                          des_imagePath)

                          VALUES ('${req.des_name}',
                                  '${req.des_dosage}',
                                  '${req.des_category}',
                                  '${req.des_description}',
                                  'assets/img/remedys/remedy.jpg')`,res)
}

function setRemedyByParams(req,iduser,remedy_menu_id,res) {

  return con.queryFunction(`INSERT INTO tb_remedys       (des_name,
                                                    des_category,
                                                    des_dosage,
                                                    des_validate,
                                                    des_description,
                                                    des_imagePath,
                                                    idtb_remedy_by_user,
                                                    idfk_remedys_menu)

                          VALUES ('${req.des_name}',
                                  '${req.des_category}',
                                  '${req.des_dosage}',
                                  '${req.des_validate}',
                                  '${req.des_description}',
                                  '${req.des_imagePath}',
                                  ${iduser},
                                  ${remedy_menu_id})`,res)

}




module.exports = {getRemedys,
                  getRemedysByMenuId,
                  getRemedysByMenuIdFunction,
                  getRemedysBySameName,
                  getRemedysByUser,
                  getRemedysById,
                  verifyUserRemedyId,
                  getRemedysMenu,
                  setRemedyMenuByParams,
                  setRemedyByParams,
                  deleteUserRemedy}
