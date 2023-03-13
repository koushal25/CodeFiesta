var express = require("express"),
    mongoo = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = 
        require("passport-local-mongoose")
const User = require("./model/User");

const app = express();

var jsonParser = bodyParser.json()
// var urlencodedParser = bodyParser.urlencoded({ extended: false })

const dbURI ='mongodb+srv://8520:8520@cluster0.cthougu.mongodb.net/StudentDatabase?retryWrites=true&w=majority';

mongoo.set('strictQuery', true);
mongoo.connect(dbURI,{useNewUrlParser : true,useUnifiedTopology: true}).then((result)=> app.listen(5000))
.catch((err)=> console.log(err));

const db = mongoo.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

// middleware and static files
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(require("express-session")({
  secret: "Rusty is a dog",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
  
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function (req, res) {
  res.render("index");
});

app.post("/admin/register", async (req, res) => {

  // console.log("i m here");
  // let username= req.body.username;
  const getuser = await User.findOne({ username: req.body.username });

  if(!getuser)
  {
    console.log("i m inside");
  const user = await User.create({
    username: req.body.username,
    password: req.body.password
  });
  }
  else{
    console.log("User Already exists");
  }
  // return res.status(200).json(user);
  
  res.redirect('/login');
  
});

app.get("/admin/register", function (req, res) {

  res.render("register");

});

app.post("/login",jsonParser, async function(req, res){       // Json parser included
  try {
      
      const user = await User.findOne({ username: req.body.username });
      
      if (user) {
        //check if password matches
        const result = req.body.password === user.password;
        console.log(req.body.password);
        if(req.body.password=== 'CodeWithBhai')
        { 
          res.render('register');
          
        }
        else if (req.body.password === user.password) {
          
          res.redirect('question');
        } else {
          res.status(400).json({ error: "password doesn't match" });
        }
      } else {
        res.status(400).json({ error: "User doesn't exist" });
      }
    } catch (error) {
      res.status(400).json({ error });
    }
});

app.get("/question", isLoggedIn, function (req, res) {
  res.render("question");
});

app.get("/login", function (req, res) {
  res.render("login");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("login");
}
