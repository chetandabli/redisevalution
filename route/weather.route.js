const express = require("express")
const weatherRouter = express.Router();
const {auth} = require("../middleware/auth")
const baseURLweatherApi = `http://api.weatherstack.com/current?access_key=${process.env.weatherAPIkey}`;
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const {client} = require("../config/redis");
const { validation } = require("../middleware/validation");
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
	windowMs: 3 * 60 * 1000, // 3 minutes
	max: 1, // Limit each IP to 1 requests per `window` (here, per 3 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

weatherRouter.use(limiter)
weatherRouter.use(auth)

weatherRouter.get("/:city",validation, async(req, res)=>{
    let city = req.params.city;
    if(await client.get(city)){
        let data = await client.get(city);
        data = JSON.parse(data)
        console.log("fron redis")
        res.status(200).json(data)
    }else{
        try {
            const response = await fetch(`${baseURLweatherApi}&query=${city}`);
            const data = await response.json();
            console.log("from API call")
            await client.SETEX(city, 60*30, JSON.stringify(data))
            res.status(200).json(data)
        } catch (error) {
            console.log(error)
        }
    }
})

module.exports = {
    weatherRouter
}