const express = require("express");
const bodyPArser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash")
const axios = require("axios");
const mongoose = require("mongoose");


require("dotenv").config();
const app = express();
app.use(bodyPArser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());

//mongoose database starts
mongoose.connect("mongodb+srv://parthtiwari:"+ process.env.API_KEY_DB +"@atlascluster.8njjjn1.mongodb.net/toDoListDB");

const itemsSchema = {
  name: String,
};
const Item = new mongoose.model("item", itemsSchema);

const item1 = new Item({
  name:" welcome to the list item"
})
const item2 = new Item({
  name:" to add click +"
})
const item3 = new Item({
  name:" to delete check the box"
})

const defaultItems = [item1 , item2 , item3];

const listSchema ={
  name: String,
  item: [itemsSchema]
}
const List = new mongoose.model("list", listSchema);



//date in javascript

let option = { weekday: "long", month: "long", day: "numeric" };
let today = new Date();
let date = today.toLocaleDateString("en-US", option);


//quote api

let apiQuote = [];
let quotes = "";
//weather api variables
let weatherData="";
let weather = "";
  let temp;
  let imgUrl = "";
  let icon = "";
  let City = "";
//db array
let listItems=[];

//Fetch weather api function

const fetchWeatherData = async (latitude, longitude)=>{
  return new Promise((resolve,reject)=>{
    const url = "https://api.openweathermap.org/data/2.5/weather?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&appid=" +
    process.env.API_KEY_W +
    "&units=metric";
    
    axios.get(url)
    .then((data)=>{
      // console.log(data.data);
      weather = data.data;
      temp = weather.main.temp;
      icon = weather.weather[0].icon;
      imgUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      City = weather.name;
      resolve({temp, imgUrl, City});
    })
    .catch((err)=>{
      console.log(err);
    })
  });
};

app.get("/", async (req, res)=>{

 try { 

    
  //quote api response
  const url = "https://api.api-ninjas.com/v1/quotes?category=happiness";
  const options = {
    headers: { "X-Api-Key": process.env.API_KEY_Q },
  };
  const quote = await axios.get(url, options);
  quotes = quote.data[0].quote;
  
//databsae fetch

  listItems = await Item.find();

  // //weather function call
  // if(req.query.lati && req.query.longi){
    
  //   // console.log(lati,longi);
  //   console.log(req.query);
  //   const weatherData = await fetchWeatherData(lati, longi);
  //   console.log(weatherData);
    res.render("index", {
      Heading:"i love you Sakshi <3",
      currentDate: date,
      quotesRandom: quotes,
      temprature:  weatherData.temp,
      icon:  weatherData.imgUrl,
      city:  weatherData.City,
      listItems:listItems
    });
  // }
  // else{
  // console.log("error");
  //     res.render("index", {
  //     currentDate: date,
  //     quotesRandom: quotes,
  //     // temprature: "weatherData.temp",
  //     // icon: "weatherData.imgUrl",
  //     // city: "weatherData.City",
  //     listItems:listItems
  //   });    
  // }

}catch (error) {
  console.error(error);
  res.status(500).send("Internal Server Error");
}
});

// custom list get request
app.get("/:customListName", async (request, response)=>{

  //quote api call
  //quote api response
  const url = "https://api.api-ninjas.com/v1/quotes?category=happiness";
  const options = {
    headers: { "X-Api-Key": process.env.API_KEY_Q },
  };
  const quote = await axios.get(url, options);
  quotes = quote.data[0].quote;

  const listTitle = _.capitalize(request.params.customListName);
  // console.log(listTitle);
  
  const list = new List({
    name: listTitle,
    item : defaultItems
  });
  
 List.findOne({name:listTitle})
 .then((data)=>{
  if(data === null){
    list.save();
    response.redirect("/" + listTitle );
    
  }
  else{
    response.render("index", {
      Heading:data.name,
      currentDate: date,
      quotesRandom: quotes,
      temprature:  weatherData.temp,
      icon:  weatherData.imgUrl,
      city:  weatherData.City,
      listItems:data.item});
    // console.log("already exist");
  }
 })
 .catch((err)=>{
  console.log(err);
 })
  

});



//Post 

app.post("/", async (req, res) => {


  let Title = req.body.list;
  
  if(req.query.lati && req.query.longi){
    const lati = req.query.lati;
    const longi = req.query.longi;
    weatherData = await fetchWeatherData(lati,longi);

  }
  else if (req.body.newItem && req.body.list) {
    // Handle the task data
    // console.log(req.body);
     Title = req.body.list;
    const newItem = req.body.newItem;
    // console.log(Title , newItem);
    // Process the task data as needed
    const item = new Item({
        name : newItem
    });
    if(Title === "to do list" ){
      await item.save()
      .then((data)=>{
        console.log(data);
        res.redirect("/");
      })
      .catch((err)=>{
        console.log(err);
      })  
    }
    else{
      List.findOne({name:Title})
      .then((data)=>{
        console.log(data);
        // console.log(item);
        data.item.push(item);
        data.save();
      })
      .catch((err)=>{
        console.log(err);
      })
      res.redirect("/" + Title)
    }

    

  } else{
    res.redirect("/" + Title);
  }
});

app.post("/delete", (req,res)=>{
  const itemToDelete = req.body.onCheck;
  const listName = req.body.listName;
  console.log(itemToDelete);

if(listName === "to do list"){
  Item.findByIdAndRemove(itemToDelete)
.then((data)=>{
  console.log("seccessfully removed item from db");
  res.redirect("/");

})
.catch((err)=>{
  console.log(err + "error occured");
  res.render("index", {
    Heading:"to do list",
    currentDate: date,
    quotesRandom: quotes,
    temprature:  weatherData.temp,
    icon:  weatherData.imgUrl,
    city:  weatherData.City,
    listItems:listItems
  });
})  
}
else{
  List.findOneAndUpdate({name:listName}, { $pull : {item : {_id : itemToDelete}}})
  .then((data)=>{
    // console.log(data);
    res.redirect("/" + listName)
  })
  .catch((err)=>{
    console.log(err);
    res.redirect("/" + listName)

  })
}


});


app.listen("3000", () => {
  console.log("server is running at port 3000");
});
