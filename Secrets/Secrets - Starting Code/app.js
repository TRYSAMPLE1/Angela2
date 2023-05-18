//jshint esversion:6
const express = require('express');
const bodyParser = require("body-parser");
const ejs = require('ejs');
const mongoose = require("mongoose");
const { log } = require('console');


const app = express();

mongoose.connect("mongodb://localhost:27017/userDBs",{useNewUrlParser:true});

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended:true
}))


const userSchema = {
    email: String,
    password: String
};

const User = new mongoose.model("User",userSchema)



app.get("/",(req,res)=>{
   res.render('home');
});

app.get("/register", (req, res) => {
   res.render('register');
  
});

app.get("/login", (req, res) => {
   res.render('login');
});

async function register (req,res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    try{
        await newUser.save();
      res.render('secrets');
    }catch(err){
        console.log(err);
    }
    
  };

  async function login(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    
    try {
        // check if the user exists
        const user = await User.findOne({ email: req.body.username});
        if (user) {
          //check if password matches
          const result = req.body.password === user.password;
          if (result) {
            res.render("secrets");
          } else {
            res.status(400).json({ error: "password doesn't match" });
          }
        } else {
          res.status(400).json({ error: "User doesn't exist" });
        }
      } catch (error) {
        res.status(400).json({ error });
      }
};

  app.post("/register",register);
  app.post("/login",login)



app.listen(3000, () => console.log(` app listening on port port! 3000`));