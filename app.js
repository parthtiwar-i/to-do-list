const express = require("express");
const bodyPArser = require("body-parser");
const ejs = require("ejs");
const https = require("https");

const app = express();
app.use(bodyPArser.urlencoded({extended:true}));
app.set("view engine" , "ejs");
app.use(express.static("public"));

//date in javascript 

let option = {weekday: "long" , month:"long", day:"numeric"}
    let today = new Date();
    let date =  today.toLocaleDateString("en-US", option);

//quote api

 let apiQuote = [];
 let quotes = "";


app.get("/", function(req, res){
    // res.sendFile(__dirname + "/index.html");
    
    const url = "https://api.api-ninjas.com/v1/quotes?category=happiness";
    
    const options = {
        headers : { 'X-Api-Key' : 'MFvQtkqQ9kkQ+DpHEBfQuA==nD7MJbemA6WiUv7z'}
    }
    console.log(req.body);  

    let weather = "";
    let temp = "";
    let imgUrl = "";
    let icon = "";

    https.get("https://api.openweathermap.org/data/2.5/weather?q=jabalpur&appid=ae76fbef3e4e18d214cc0b148c1b35af&units=metric", (res)=>{
        res.on("data", (data)=>{
            weather = JSON.parse(data);
            temp = weather.main.temp;
            icon= weather.weather[0].icon;
            imgUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
            console.log(imgUrl);
        } )
    });

    https.get(url , options , (response)=>{
        response.on('data' , (body)=>{
             apiQuotes = JSON.parse(body);
             quotes  = apiQuotes[0].quote;

            } )
            res.render("index", {currentDate : date,  quotesRandom: quotes,temprature:temp, icon:imgUrl});
        })
        
})

app.listen("3000", ()=>{
    console.log("server is running at port 3000");
})


//api key   -           MFvQtkqQ9kkQ+DpHEBfQuA==nD7MJbemA6WiUv7z