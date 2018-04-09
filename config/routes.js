const express= require('express')
const token = require ('jsonwebtoken')
const auth = require ('../api/login/auth')
const env = require('../.env')
const bcrypt = require('bcrypt')
const mailsender = require('../api/mailsender/mailsender')

module.exports = function (server) {

  const router = express.Router()
  server.use('/api',router)


//LOGIN-----------------------------------------------------------------------------------------------------------------
 const login= require('../api/login/login')


 router.post('/login',(req,res,next)=>{

   var passwordsMatch
   var user_name

   var obj = {
       user_mail:req.body.des_mail,
       user_password:req.body.des_password,
   }

    login.getUserPassword(obj.user_mail,function (err,rows) {
      if(rows.length > 0){

        user_name = rows[0].nom_name

        if(bcrypt.compareSync(obj.user_password,rows[0].des_password)){

          const tkr = token.sign({sub:obj.user_mail,iss:"gmr-api",exp: Math.floor(Date.now() / 1000) + (60 * 60)},env.secret)

             res.send({res : "login-access-success",
                      user_mail:obj.user_mail,
                      nom_name:user_name,
                      accessToken:tkr})

        }else{
          res.status(403).send({res: "login-access-fail"})
        }

      }else{

          res.status(403).send({res: "login-access-fail"})
      }



    })

 })

 router.post('/login/forgotPassword',(req,res,next)=>{
  const editUser= require('../api/register/editUser')

   editUser.getVerifyIfUserExists(req.body.des_mail,function (err,rows) {
     if(rows.length > 0){

       let newPassword = editUser.generatePassword()
       console.log(newPassword)

       var salt = bcrypt.genSaltSync(10)
       var hash = bcrypt.hashSync(newPassword,salt)

       editUser.setEditUserPassword(req.body.des_mail,hash)

       var mailObj = {
         from:'no-reply@getmyremedy.com.br',
         to:`${req.body.des_mail}`,
         subject:`GetMyRemedy: Nova Senha`,
         html:`<h3> Olá ${rows[0].nom_name} ! </h3>
               <p>  Conforme solicitado segue a nova senha: ${newPassword}
               <p>  Lembrando que você pode alterar a senha a qualquer momento clicando em cima do seu e-mail quando estiver logado na aplicação</p>

               <p> Qualquer duvida nos envie um email : suporte@getmyremedy.com.br</p>
               <p> Será um prazer lhe atender.</p>

               <small>Esse é um e-mail gerado automaticamente, favor não responder</small>`
             }

       mailsender.sendMail(mailObj)

       res.json("Nova senha enviada por e-mail")

     }else{
       res.status(400).json("Error: O e-mail informado não existe")
     }

   })

 })

 //REGISTER NEW USER-----------------------------------------------------------------------------------------------------------
 const register= require('../api/register/register')

 router.post('/register',(req,res,next)=>{

   var salt = bcrypt.genSaltSync(10)
   var hash = bcrypt.hashSync(req.body.des_password,salt)


   var obj ={nom_name:req.body.nom_name,
              des_mail:req.body.des_mail,
              des_address:req.body.des_address,
              des_city:req.body.des_city,
              des_state:req.body.des_state,
              num_cep:req.body.num_cep,
              num_phone:req.body.num_phone,
              des_password:hash}


    register.getVerifyIfUserExists(obj.des_mail,function(err,rows) {
        console.log(rows.length)

        if(rows.length > 0){

            res.status(401).json({res: "e-mail já cadastrado, forneça outro."})

        }else{

          var mailObj = {
            from:'no-reply@getmyremedy.com.br',
            to:`${obj.des_mail}`,
            subject:`GetMyRemedy: Cadastro efetuado com sucesso!`,
            html:`<h3> Olá ${obj.nom_name} ! </h3>
                  <p>  Seu cadastro foi efetuado com sucesso! ficamos felizes em te receber </p>
                  <p>  Com nossa aplicação você poderá escolher remedios no quais precisa de doação, inclusive contribuir com as outras pessoas.</p>
                  <p>  Lembre-se de sempre solicitar a receita quando te pedirem a doação, e entregar a receita quando receber alguma. Somente um médico especializado pode indicar a medicação correta.</p>
                  <p>  Nossa plataforma apenas ajuda a ligar quem precisa de doação com quem está disposto a doar, informando o medicamento e contato da pessoa, apenas e-mail, telefone, e cidade quaisquer outras informações não são passadas.</p>

                  <p> Qualquer duvida nos envie um email : suporte@getmyremedy.com.br</p>
                  <p> Será um prazer lhe atender.</p>

                  <small>Esse é um e-mail gerado automaticamente, favor não responder</small>`
                }

                mailsender.sendMail(mailObj)

            register.setRegisterNewUser(obj)
            res.send({res: "Usuário registrado com sucesso"})
        }

    })

 })
 //EDIT USER -----------------------------------------------------------------------------------------------------------
  const editUser= require('../api/register/editUser')

/*------------------------------------------------------------------
router.get('/users/:id?',(req,res)=>{
  if(req.params.id){
  return editUser.getUser(req.params.id,res)
} })
PEGAR DADOS DO USUARIO
------------------------------------------------------------------*/
router.use('/users/verifyToken',(req,res,next)=>{

  if(req.method == "OPTIONS"){

    res.json({res:"ok"})

  }else{


    let tkr = undefined
    let splited

    if(req.body.headers && req.body.headers.Authorization){
      splited = req.body.headers.Authorization.toString()
      const parts = [] = splited.split(' ')

      if(parts.length == 2 && parts[0] == 'Bearer'){
        tkr = parts[1]
      }
    }

    if(!tkr){

      res.setHeader('WWW-Authenticate','Bearer token_type="JWT"')
      res.status(401).json({res: "Você precisa se autenticar."})

    }else{

      token.verify(tkr,env.secret,(error,decoded)=>{

        if(decoded){
          res.json({res: 'authorized'})
          next()
        }else{
          res.status(403).json({res: 'Não autorizado.'})
        }

      })

      }

    }
})

router.get('/users/remedys/:id?',(req,res) =>{
  var user_id

    if(req.params.id){

      remedysComment.getUserId(req.params.id,function(err,rows) {
          if(rows.length > 0){
            user_id = rows[0].idtb_users
            return remedys.getRemedysByUser(user_id,res)

          }else{
            res.status(403).send({res: "falha ao obter dados"})
          }
      })

  }})

  router.delete('/users/remedys/:id?',auth.handleAuthorization,(req,res) =>{

    console.log(req.params.id)
      if(req.params.id){

        remedys.getRemedysById(req.params.id,function(err,rows) {
            if(rows.length > 0){

              return remedys.deleteUserRemedy(req.params.id,res)

            }else{
              res.status(403).send({res: "remédio não existe"})
            }
        })

    }
  })

 router.use('/users/edit',auth.handleAuthorization,(req,res,next)=>{

   var salt = bcrypt.genSaltSync(10)
   var hash = bcrypt.hashSync(req.body.des_password,salt)

   editUser.getVerifyIfUserExists(req.body.des_mail,function(err,rows) {
       console.log(rows.length)

       if(rows.length > 0){

           editUser.setEditUser(req.body,hash)
           //res.send({res: "Usuário alterado com sucesso"})

       }else{
            res.status(401).json({res: "Usuário não existe."})
       }

   })


 })

 //Remedys----------------------------------------------------------------------------------------------------------------
  const remedys = require('../api/remedys/remedys')


  router.route('/remedys/remedys').get(remedys.getRemedys)

  router.route('/remedys/remedysMenu').get(remedys.getRemedysMenu)

  router.get('/remedys/remedysMenu/:id?',(req,res) =>{
    if(req.params.id){
    return remedys.getRemedysByMenuId(req.params.id,res)
  }})

  router.get('/remedys/remedysMenu/category/:id?',(req,res)=> {
    if(req.params.id){
      return remedys.getRemedysByMenuCategory(req.params.id,res)
    }
  })

  router.get('/remedys/search/remedyMenu/:id?',(req,res)=>{
    if(req.params.id){
      console.log(req.params.id)
      return remedys.getRemedysByMenuName(req.params.id,res)
    }
  })

  router.get('/remedys/:id?',(req,res) =>{

    if(req.params.id){
           remedys.deleteExpiredRemedys()
    return remedys.getRemedysBySameName(req.params.id,res)
  }})


  router.use('/remedys/registerNewRemedy',auth.handleAuthorization, (req,res) => {
    var user_id
    var remedy_menu_id

    remedys.getRemedysByMenuIdFunction(req.body.des_name,req.body.des_dosage,function (err,rows) {
          if(rows.length > 0){
            remedy_menu_id = rows[0].idtb_remedys_menu

            remedys.verifyUserRemedyId(req.body.idtb_remedy_by_user, function(err, rows) {
                  if (rows.length > 0){

                    var mailObj = {
                      from:'no-reply@getmyremedy.com.br',
                      to:`${req.body.idtb_remedy_by_user}`,
                      subject:`GetMyRemedy: Anúncio Criado`,
                      html:`<h3> Olá ${req.body.nom_name} ! </h3>
                            <p>  Seu anúncio do remédio ${req.body.des_name}/${req.body.des_dosage} foi criado com sucesso! </p>
                            <p>  fique atento a data de validade: ${req.body.des_validate} pois o mesmo será excluido assim que a data for atingida.</p>

                            <h3>  Informações adicionais: </h3>
                            <p> Categoria: ${req.body.des_category}</p>
                            <p> Descrição: ${req.body.des_description}</p>

                            <p> Agradecemos a contribuição para tornarmos o mundo um lugar mais colaborativo e acessivel a todos!</p>
                            <small>Esse é um e-mail gerado automaticamente, favor não responder</small>`
                          }

                    mailsender.sendMail(mailObj)

                    user_id = rows[0].idtb_users
                    remedys.setRemedyByParams(req.body,user_id,remedy_menu_id)

                  }
                  else{
                    res.send("Erro ao cadastrar")

                   }
              })

          }else{

        remedys.setRemedyMenuByParams(req.body,function(err,rows) {

              if (rows.length > 0){
                  console.log("err")
              }else{

                remedys.verifyUserRemedyId(req.body.idtb_remedy_by_user, function(err, rows) {
                                if (rows.length > 0){

                                    user_id = rows[0].idtb_users

                                    remedys.getRemedysByMenuIdFunction(req.body.des_name,req.body.des_dosage, function(err,rows) {

                                          if (rows.length > 0){

                                            var mailObj = {
                                              from:'no-reply@getmyremedy.com.br',
                                              to:`${req.body.idtb_remedy_by_user}`,
                                              subject:`GetMyRemedy: Anúncio Criado`,
                                              html:`<h3> Olá ${req.body.nom_name} ! </h3>
                                                    <p>  Seu anúncio do remédio ${req.body.des_name}/${req.body.des_dosage} foi criado com sucesso! </p>
                                                    <p>  fique atento a data de validade: ${req.body.des_validate} pois o mesmo será excluido assim que a data for atingida.</p>

                                                    <h3>  Informações adicionais: </h3>
                                                    <p> Categoria: ${req.body.des_category}</p>
                                                    <p> Descrição: ${req.body.des_description}</p>

                                                    <p> Seu remédio ainda não estava cadastrado em nossa base, por tanto foi criado uma nova categoria incluindo o seu remédio</p>

                                                    <p> Agradecemos a contribuição para tornarmos o mundo um lugar mais colaborativo e acessivel a todos!</p>
                                                    <small>Esse é um e-mail gerado automaticamente, favor não responder</small>`
                                                  }

                                            mailsender.sendMail(mailObj)

                                            remedys.setRemedyByParams(req.body,user_id,rows[0].idtb_remedys_menu)

                                          }else{
                                            console.log("não achou remedio pelo id do menu")
                                          }
                                      })

                        }else{
                          res.send("Erro ao cadastrar")
                      }
                  })
              }

            })

          }
    })

  })

  //RemedysComment------------------------------------------------------------------------------------------------------------
  const remedysComment = require("../api/remedys/remedysComments")

  router.get('/remedys/:id?/comments',(req,res) =>{

    if(req.params.id){
    return remedysComment.getRemedysCommentsOfRemedy(req.params.id,res)
  }})

  router.post('/remedys/comments',auth.handleAuthorization, (req,res,next)=>{
    var user_id
    var remedysMenu_id

      var obj = {
                    des_comment:req.body.des_comment,
                    des_date: req.body.des_date,
                    des_remedy_name: req.body.des_remedy_name,
                    des_remedy_dosage:req.body.des_remedy_dosage,
                    user_mail:req.body.user_mail
      }

      remedysComment.getUserId(obj.user_mail,function(err,rows) {
          if(rows.length > 0){
            user_id = rows[0].idtb_users

            remedysComment.getRemedysMenuId(obj,function(err,rows) {
              if(rows.length > 0){

                remedysMenu_id = rows[0].idtb_remedys_menu
                remedysComment.setRemedysCommentsOfRemedy(obj,user_id,remedysMenu_id)

              }else{

                res.status(403).send({res: "login-access-fail"})
              }

            })

          }else{
            res.status(403).send({res: "login-access-fail"})
          }
      })

  })


}
