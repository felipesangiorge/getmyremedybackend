const mysql = require('mysql')
const connection = mysql.createPool({
host : 'localhost',
port: 3306,
user:'root',
password:'',
database:'db_getmyremedyapp'
})


function connectionCheck(){
  connection.connect(function(err) {
    if(err){
      console.log("-------------------------------------------------------")
      console.log(err)

    }else{
    console.log("conectado")
    }
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

function queryFunction(sqlQry,cb) {
  console.log("QueryFunction: "+sqlQry)
  connection.query(sqlQry,cb)


}

function query(sqlQry,res){
  connection.query(sqlQry,function (err,results,fields) {
    console.log("Query: "+sqlQry)
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
