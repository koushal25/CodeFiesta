var express = require("express"),
  mongoo = require("mongoose"),
  passport = require("passport"),
  bodyParser = require("body-parser"),
  LocalStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose");
const User = require("./model/User");

const session = require("express-session");
const app = express();

//Added Afterwards
const cors = require("cors");
const { spawn } = require("child_process");
const { generateFile } = require("./generateFile");
const { runcodes } = require("./executebhai");
const fs = require("fs");

app.use(cors());
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const dbURI =
  "mongodb+srv://8520:8520@cluster0.cthougu.mongodb.net/StudentDatabase?retryWrites=true&w=majority";

mongoo.set("strictQuery", true);

mongoo
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(5000))
  .catch((err) => console.log(err));

const db = mongoo.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

// middleware and static files
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(
  require("express-session")({
    secret: "Rusty is a dog",
    resave: false,
    saveUninitialized: false,
    cookie: { _expires: 60 * 60 * 1000 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", async function (req, res) {
  try {
    res.render("index");
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
});

app.post("/admin/register", async (req, res) => {
  try {
    const getuser = await User.findOne({ username: req.body.username });

    if (!getuser) {
      const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        loggedin: true,
      });
    } else {
      console.log("User Already exists");
    }

    res.redirect("/admin/register");
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
});

app.get("/admin/register", async function (req, res) {
  try {
    res.render("register");
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
});

app.post("/login", jsonParser, async function (req, res) {
  // Json parser included
  try {

    const user = await User.findOne({ username: req.body.username });
    console.log(req.body.username);

      
      if(!(await user.loggedin === true))
      {
        res.status(400).json({ error: "You can attempt the test only once" });
        res.end();
        // res.redirect("/");
      }

    else{        //else
    if (user) {
      //check if password matches
      const result = req.body.password === user.password;
      console.log(req.body.password);
      if (req.body.password === "CodeWithBhai") {
        res.redirect("/admin/register");
      } else if (req.body.password === user.password) {
        req.session.userId = req.body.username;

        res.render('instruction');
      } else {
        res.status(400).json({ error: "password doesn't match" });
      }
    } else {
      res.status(400).json({ error: "User doesn't exist" });
    }

  } // else

  } catch (error) {
    res.status(400).json({ error });
  }
});

app.get("/instruction", async function (req, res) {
  try {

    res.render("instruction");
  


  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
});

app.get("/question", async function (req, res) {
  try {

    // const startTime=new Date().getTime;
    const username = req.session.username;
    console.log(username);
    res.render("question");
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
});

app.post("/question/question1", async function (req, res) {
  try {
    //added afterwards

    const code = req.body.textinput;
    const language = "bhai";

    if (code == "undefined") {
      res.redirect("/question");
    }

    var UserName = req.session.userId;
    var Name = UserName + "_Q1";

    if (UserName) {
      const { filePath, fileName } = await generateFile(
        UserName,
        Name,
        language,
        code
      );
      runcodes(filePath, fileName);
    } else {
      res.redirect("/login");
    }

    // res.status(200).json({filePath});

    //ADDED UP

    var ans = req.body.textinput;

    const haiku = db.collection(req.session.userId);

    if (!haiku) {
      db.createCollection(req.session.userId, function (err, res) {
        if (err) throw err;
        console.log("Collection created!");
      });
    }
    const doc = {
      Q_no: "Question-1",
      time: new Date().getTime(),
      code: ans,
    };

    const result = haiku.insertOne(doc);
    res.redirect("/question");
  } catch (err) {
    // res.redirect("/login");
    console.log(err);
  }
});

app.post("/question/question2", async function (req, res) {
  try {
    //added afterwards

    const code = req.body.textinput;
    const language = "bhai";

    if (code == "undefined") {
      res.redirect("/question");
    }

    var UserName = req.session.userId;
    var Name = UserName + "_Q2";

    if (UserName) {
      const { filePath, fileName } = await generateFile(
        UserName,
        Name,
        language,
        code
      );
      runcodes(filePath, fileName);
    } else {
      res.redirect("/login");
    }

    //ADDED UP

    var ans = req.body.textinput;

    const haiku = db.collection(req.session.userId);

    if (!haiku) {
      db.createCollection(req.session.userId, function (err, res) {
        if (err) throw err;
        console.log("Collection created!");
      });
    }
    const doc = {
      Q_no: "Question-2",
      time: new Date().getTime(),
      code: ans,
    };

    const result = haiku.insertOne(doc);
    res.redirect("/question");
  } catch (err) {
    res.redirect("/login");
    console.log(err);
  }
});

app.post("/question/question3", async function (req, res) {
  try {
    //added afterwards

    const code = req.body.textinput;
    const language = "bhai";

    if (code == "undefined") {
      res.redirect("/question");
    }

    var UserName = req.session.userId;
    var Name = UserName + "_Q3";

    if (UserName) {
      const { filePath, fileName } = await generateFile(
        UserName,
        Name,
        language,
        code
      );
      runcodes(filePath, fileName);
    } else {
      res.redirect("/login");
    }

    //ADDED UP

    var ans = req.body.textinput;

    const haiku = db.collection(req.session.userId);

    if (!haiku) {
      db.createCollection(req.session.userId, function (err, res) {
        if (err) throw err;
        console.log("Collection created!");
      });
    }
    const doc = {
      Q_no: "Question-3",
      time: new Date().getTime(),
      code: ans,
    };
    const result = haiku.insertOne(doc);
    res.redirect("/question");
  } catch (err) {
    res.redirect("/login");
    console.log(err);
  }
});

app.get("/question/question1", async function (req, res) {
  try {
    res.render("question1");
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
});
app.get("/question/question2", async function (req, res) {
  try {
    res.render("question2");
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
});

app.get("/question/question3", async function (req, res) {
  try {
    res.render("question3");
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
});

app.get("/login", async function (req, res) {
  try {
    res.render("login");
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
});
app.get("/logout", async function (req, res) {
  try {
    const UserName=req.session.userId;
    User.findOneAndUpdate({username: UserName }, 
      {loggedin:false}, null, function (err, docs) {
      if (err){
          console.log(err)
      }
      
  });
    req.logout(async function (err) {
      if (err) {
        return next(err);
      }

        res.render("logout1");
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
});

app.post("/logout", async function (req, res) {
  try {
    
    const UserName=req.session.userId;
    User.findOneAndUpdate({username: UserName }, 
      {loggedin:false}, null, function (err, docs) {
      if (err){
          console.log(err)
      }
      
  });
    req.logout(async function (err) {
      if (err) {
        return next(err);
      }
      res.render("logout1");
      
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
});

app.use(async (req, res) => {
  res.render("404");
});

// function isLoggedIn(req, res, next) {
//   if (req.isAuthenticated()) return next();
//   res.redirect("login");
// }
