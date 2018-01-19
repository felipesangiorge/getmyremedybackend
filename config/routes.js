const express= require('express')
const token = require ('jsonwebtoken')
const auth = require ('../api/login/auth')
const env = require('../.env')

module.exports = function (server) {

  const router = express.Router()
  server.use('/api',router)


//LOGIN
 const login= require('../api/login/login')


 router.post('/login',(req,res,next)=>{

    var obj = {
        user_mail:req.body.des_mail,
        user_password:req.body.des_password
    }

    console.log(obj)
    login.getLoginUser(obj, function(err, rows) {
         if (rows.length > 0){

        const tkr = token.sign({sub:obj.user_mail,iss:"gmr-api"},env.secret)

           res.send({res : "login-access-success",
                    accessToken:tkr})
         }
         else{
            res.status(403).send({res: "login-access-fail"})
          }
     })

 })

//TASKLIST
  const remedys = require('../api/remedys/remedys')

  //TASKLIST_GET
  router.route('/remedys/remedys').get(remedys.getRemedys)

  router.route('/remedys/remedysMenu').get(remedys.getRemedysMenu)

  router.get('/remedys/remedysMenu/:id?',(req,res) =>{
    if(req.params.id){
    return remedys.getRemedysByMenuId(req.params.id,res)
  }})

  router.get('/remedys/:id?',(req,res) =>{
    if(req.params.id){
    return remedys.getRemedysBySameName(req.params.id,res)
  }})


  //Authorization_Create-Remedy
/*  router.use('/registerNewRemedy',(req,res,next) =>{
    auth.handleAuthorization
  })*/
  router.use('/registerNewRemedy',auth.handleAuthorization)

//  const auth = require('../api/login/auth')
//  server.use('/registerNewRemedy',auth)

//USER
  /*const user = require ('../api/user/user')

//USER_GET
  router.route('/user').get(user.getAllUsers)

  router.get('/user/:id?' ,(req,res) =>{
    if(req.params.id) idUser= parseInt(req.params.id)
    return user.getUserById(idUser,res)
  })
//USER_PUT
  router.put('/user', (req,res,next) =>{

      var obj =   {name:req.body.des_name,
                  email:req.body.des_email,
                  endereco:req.body.des_endereco,
                  cep:req.body.num_cep,
                  phone:req.body.num_phone,
                  password:req.body.des_password}

            user.verifyUser(obj.name, function(err, rows) {
                 if (rows.length > 0){
                   res.send({res : "usuário já cadastrado"})
                 }
                 else{
                  user.setUserByParams(obj,res)
                    res.send({res: "usuário cadastrado com sucesso!"})
                  }
             })
  })

//USER_POST

      router.post('/user/:id?',(req,res) =>{
        if(req.params.id) id=parseInt(req.params.id)
        var obj= {idUser:id,
                  name:req.body.des_name,
                  email:req.body.des_email,
                  endereco:req.body.des_endereco,
                  cep:req.body.num_cep,
                  phone:req.body.num_phone,
                  password:req.body.des_password}

        user.verifyUserById(obj.idUser,function (err, rows) {
          if(rows.length>0){
              user.updateUserByParams(obj,res)
              res.send({res:'Usuário alterado com sucesso'})
          }else{
              res.send({res:'Usuário não cadastrado'})
          }
        })

      })

//USER_DELETE
  router.delete('/user/:id?',(req,res) =>{

        if(req.params.id) id=parseInt(req.params.id)
        var obj = {idUser :id}

            user.verifyUserById(obj.idUser,function(err, rows) {
               if(rows.length > 0){
                 user.deleteUserByParams(obj,res)
                   res.send({res: "Usuário deletado com sucesso"})
               }else{
                  res.send({res: "Usuário não cadastrado"})
               }
             })
  })

//END_USER*/

}
