const mysql = require('mysql')
const connection = mysql.createConnection({
host : 'localhost',
port: 3306,
user:'root',
password:'',
database:'db_getmyremedyapp'
})


function connectionCheck(){
  connection.connect(function(err) {
    if(err) console.log(err)
    console.log("conectado")
  })
}

function queryGet(sqlQry,res){
  connection.query(sqlQry,function (err,results,fields) {
    if(err){
      res.json(err)
    }else{
      res.json(results)

    }
  })
}

function queryFunction(sqlQry, cb) {
  console.log(sqlQry)
  connection.query(sqlQry, cb)

}

function query(sqlQry,res){
  connection.query(sqlQry,function (err,results,fields) {
    console.log(sqlQry)
    if(err){
      console.log(err)
      return err

    }else{

      return results

    }
  })
}


module.exports = {connectionCheck,queryGet,
                  query,queryFunction}
