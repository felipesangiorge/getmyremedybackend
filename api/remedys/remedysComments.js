const con = require('../../config/database')

function getUserId(req,res) {
  return con.queryFunction(`SELECT idtb_users FROM tb_users WHERE des_mail like '${req}'`,res)
}

function getRemedysMenuId(req,res) {
return con.queryFunction(`SELECT idtb_remedys_menu FROM tb_remedys_menu WHERE des_name like '${req}'`,res)
}

function getRemedysCommentsOfRemedy(req,res){
  return con.queryGet(`SELECT tb_users.nom_name,tb_remedys_comments.des_comment,tb_remedys_comments.des_date FROM tb_remedys_comments
INNER JOIN tb_users  ON tb_remedys_comments.idfk_users = tb_users.idtb_users
INNER JOIN tb_remedys_menu ON tb_remedys_comments.idfk_remedys_menu = idtb_remedys_menu
WHERE tb_remedys_menu.idtb_remedys_menu like '${req}'`,res)
}

function setRemedysCommentsOfRemedy(req,user_id,remedysMenu_id,res) {
  return con.query(`INSERT INTO tb_remedys_comments       (des_comment,
                                                          des_date,
                                                          idfk_remedys_menu,
                                                          idfk_users
                                                          )

                          VALUES ('${req.des_comment}',
                                  '${req.des_date}',
                                  ${remedysMenu_id},
                                  ${user_id})`,res)

}


module.exports = {getRemedysCommentsOfRemedy,
                  getUserId,setRemedysCommentsOfRemedy,
                  getRemedysMenuId}
