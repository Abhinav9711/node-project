const { isEmpty, get } = require('lodash');
const nodeMailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { constants } = require('../constant');

const createUser = async(req, res) => {
  try {
    const email = get(req.body, 'email');
    const userName = get(req.body, 'username');
    const password = get(req.body, 'password');
    const confirmPassword = get(req.body, 'confirmpassword');
  
    if(isEmpty(email) || isEmpty(userName) || isEmpty(password) || isEmpty(confirmPassword)) {
      res.json({message: 'Please pass all the required values'});
      return ;
    }

    if(!email.match(constants.VALID_REGEX)) {
      res.json({message: 'Entered email does not exists, Please enter correct email'});
      return ;
    }
  
    if(password !== confirmPassword) {
      res.json({messsage: 'Password are not matching, Please insert correct password'});
      return ;
    }
  
    const userDetails = new User({
      email,
      userName,
      password,
      createdAt: new Date()
    })
    await userDetails.save();

    res.status(200).json({message: `User : ${userName}, registered successfully`});
  }
  catch(error) {
    res.status(400).json({'error': error.message});
  }
}

const signInUser = async(req, res) => {
  try {
    const userName = get(req.body, 'username');
    const password = get(req.body, 'password');

    const userData = await User.findOne({userName, password});
    if(isEmpty(userData)) {
      res.status(404).json({message: 'Auth failed', reasons: `Wrong username, password | User does not exist`});
      return ;
    }

    const email = get(userData, 'email');
    const token = jwt.sign( 
      {
        userName: userName,
        password: password,
        email: email
    },
    'secret',
    {
      expiresIn: '10min'
    })

    console.log('env: ', process.env.Node_env);
    console.log( process.env.Node_env === 'production');
    if (process.env.Node_env === 'production') {
      res.status(200).json({
        text: `'Hi ${userName}, \n 'Please find the Authorization key and use it in headers', \n 'Authorization': ${token} `
      })
      return ;
    }
    const response = await sendMail(userName, email, token);
    if(response) {
      res.status(200).json({
        message: "Email sent successfully",
        email: email
      })
      return ;
    }
    else {
      re.status(400).json({
        messgae: 'Can not send mail, Error',
        email: email,
        user: userName
      })
  }
  }
  catch(error) {
    res.status(400).json(error);
  }
}

const sendMail = async (user, email, token) => {
  try {
    console.log('password:', process.env.EMAIL_PASSWORD);
    return new Promise((resolve, reject)=>{
    var transporter = nodeMailer.createTransport({
      service: constants.SERVICE,
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    var mailOptions = {
      from: process.env.EMAIL_ID,
      to: email,
      subject: constants.SUBJECT,
      text: `'Hi ${user}, \n 'Please find the Authorization key and use it in headers', \n 'Authorization': ${token} `
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        resolve(false);
        console.log(error);
      } else {
        resolve(true);
        console.log('Email sent: ' + info.response);
      }
    });
  })
  }
  catch(error) {
    res.status(400).json({error: error});
  }
}

const checkConnection = async(req, res) => {
  try {
    res.send('connected successful');
  }
  catch(error) {
    res.error('error:', error);
  }
}

module.exports = {
  createUser,
  signInUser,
  checkConnection
}

