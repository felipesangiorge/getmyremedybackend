const con = require('../../config/database')

function getUserId(req,res) {
  return con.queryFunction(`SELECT idtb_users FROM tb_users WHERE des_mail like '${req}'`,res)
}

function getRemedysMenuId(req,res) {
return con.queryFunction(`SELECT idtb_remedys_menu FROM tb_remedys_menu WHERE des_name like '${req}'`,res)
}

function getRemedysCommentsOfRemedy(req,res){
  return con.queryGet('SELECT * FROM tb_remedys',res)
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
                                  ${user_id}`,res)

}


module.exports = {getRemedysCommentsOfRemedy,
                  getUserId,setRemedysCommentsOfRemedy,
                  getRemedysMenuId}
