const con = require('../../config/database')


function getAllStates(res){
  return con.queryGet('SELECT Nome FROM tb_estado',res)
}

function getUfOfState(req,res) {
  return con.queryFunction(`SELECT Uf FROM tb_estado WHERE Nome like '${req}'`,res)

}

function getCityOfState(req,res){
  return con.queryGet(`SELECT Nome FROM tb_municipio WHERE Uf like '${req}' `,res)
}

module.exports = {getAllStates,
                  getUfOfState,
                  getCityOfState}
