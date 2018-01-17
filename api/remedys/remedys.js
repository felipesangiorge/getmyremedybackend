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

function verifyTaskList(idUserTaskList,taskListName,cb){
  return con.queryFunction(`SELECT * FROM TB_tasklist tl INNER JOIN tb_user us ON (tl.cod_id_user_tasklist = us.cod_iduser)
  WHERE cod_id_user_tasklist = ${idUserTaskList} AND des_nom_tasklist like "${taskListName}"`,cb)
}

function verifyTaskListById(id,cb){
  return con.queryFunction(`SELECT * FROM TB_tasklist WHERE cod_idtasklist = ${id}`,cb)
}

function setTaskListByParams(req,res) {

  return con.query(`INSERT INTO db_lifeapp.TB_tasklist (cod_id_user_tasklist,
                                                    des_nom_user_tasklist,
                                                    des_nom_tasklist,
                                                    des_type_tasklist,
                                                    des_tasklist,
                                                    des_date)
                          VALUES (${req.idUserTaskList},
                                  '${req.taskListUserName}',
                                  '${req.taskListName}',
                                  '${req.taskListType}',
                                  '${req.taskListText}',
                                  '${req.date}')`,res)

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
                  verifyTaskList,verifyTaskListById,getRemedysMenu,
                  setTaskListByParams,updateTaskListByParams,deleteTaskListByParams}
