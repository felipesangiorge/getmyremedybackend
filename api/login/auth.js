const token = require ('jsonwebtoken')
const env = require('../../.env')


const handleAuthorization = (req,res,next) =>{
  const tkr = extractToken(req)

  if(req.method == "OPTIONS"){

    res.json({res:"ok"})

  }else{

  if(!tkr){

    res.setHeader('WWW-Authenticate','Bearer token_type="JWT"')
    res.status(401).json({res: "Você precisa se autenticar."})

  }else{

    token.verify(tkr,env.secret,(error,decoded)=>{

      if(decoded){
          if(req.method == "GET"){
          next()
          
      }else{
          res.json({res: 'authorized'})
          next()
        }
      }else{
        res.status(403).json({res: 'Não autorizado.'})
      }

    })

    }
  }
}

const extractToken = (req) =>{
  let tkr = undefined


  if(req.headers && req.headers.authorization){
    const parts = [] = req.headers.authorization.split(' ')

    if(parts.length == 2 && parts[0] == 'Bearer'){
      tkr = parts[1]
    }
  }
  return tkr
}


module.exports= {handleAuthorization,extractToken}
