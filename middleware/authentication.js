const jwt = require('jsonwebtoken');

const userAuthentication = async (req, res, next) => {
  try{
    var token = req.headers.authorization;
    var decode = jwt.verify(token, 'secret');
    req.userData = decode;
    next();
  }
  catch(error){
    res.status(401).json({error: "invalid token"});
  }
}

module.exports = userAuthentication;