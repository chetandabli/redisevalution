const express = require('express')
const app = express();
const {connection} = require("./config/db");
require('dotenv').config();
const {userRouter} = require("./route/user.route")
const {weatherRouter} = require("./route/weather.route");
const winston = require('winston');
const expressWinston = require('express-winston');
require('winston-mongodb');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('home page of weather app')
})

app.use("/user", userRouter);
app.use("/weather", weatherRouter);

app.use(expressWinston.errorLogger({
    transports: [
      new winston.transports.Console()
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    )

}));

app.listen(process.env.PORT, async()=>{
    try {
        await connection;
        console.log("connected to DB")
    } catch (error) {
        console.log(error)
    }
    console.log("server is running on port ", process.env.PORT)
})