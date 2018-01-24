const con = require('../../config/database')


function getRemedys(req,res){
  return con.queryGet('SELECT * FROM TB_remedys',res)
}

function getRemedysMenu(req,res){
  return con.queryGet('SELECT * FROM tb_remedys_menu',res)
}

function getRemedysByMenuId(id,res){
    return con.queryGet(`SELECT * FROM tb_remedys_menu WHERE des_name like "${id}"`,res)
}

function getRemedysBySameName(id,res){
    return con.queryGet(`SELECT * FROM tb_remedys
                        INNER JOIN tb_users  ON tb_remedys.idtb_remedy_by_user   = tb_users.idtb_users
                        WHERE des_name like "${id}" `,res)
}

function verifyUserRemedyId(idtb_remedy_by_user,cb){
  return con.queryFunction(`SELECT idtb_users FROM tb_users WHERE des_mail like "${idtb_remedy_by_user}"`,cb)
}

function verifyTaskListById(id,cb){
  return con.queryFunction(`SELECT * FROM TB_tasklist WHERE cod_idtasklist = ${id}`,cb)
}

function setRemedyByParams(req,iduser,res) {

  return con.query(`INSERT INTO tb_remedys       (des_name,
                                                    des_category,
                                                    des_dosage,
                                                    des_validate,
                                                    des_description,
                                                    des_imagePath,
                                                    idtb_remedy_by_user)

                          VALUES ('${req.des_name}',
                                  '${req.des_category}',
                                  '${req.des_dosage}',
                                  '${req.des_validate}',
                                  '${req.des_description}',
                                  '${req.des_imagePath}',
                                  ${iduser})`,res)

}

function updateTaskListByParams(req,res){
  return con.query(`UPDATE db_lifeapp.tb_tasklist SET des_nom_tasklist='${req.taskListName}',
                                                  des_type_tasklist='${req.taskListType}',
                                                  des_tasklist='${req.taskListText}',
                                                  des_date='${req.date}'


                                WHERE cod_idtasklist = ${req.tasklistId}`)
}

function deleteTaskListByParams(req,res){
  return con.query(`DELETE FROM tb_tasklist where cod_idtasklist = ${req.idTasklist}`)
}

module.exports = {getRemedys,getRemedysByMenuId,getRemedysBySameName,
                  verifyUserRemedyId,verifyTaskListById,getRemedysMenu,
                  setRemedyByParams,updateTaskListByParams,deleteTaskListByParams}
