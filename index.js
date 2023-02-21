require('dotenv').config()
const express = require('express');
const app = express();

const { connectDb } = require('./dbConnection/connect');
const taskRouter = require('./router/taskRouter');
const userRouter = require('./router/userRouter')
const userAuthentication = require('./middleware/authentication')

const port = process.env.port || 5000;

app.use(express.json());
//app.use('/task', userAuthentication, taskRouter);
app.use('/task', taskRouter);
app.use('/user', userRouter);
app.use('/test', userRouter);
app.use('/', (req, res) => {
  res.send("Welcome to the Task Management System");
})

const start =  async() => {
  try {
    await connectDb();
    app.listen(port, function () {
      console.log(`server is running on port: `, port);
    })
  }
  catch (error) {
    console.log(error);
  }
}

start();