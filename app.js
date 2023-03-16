var express = require("express"),
  mongoo = require("mongoose"),
  passport = require("passport"),
  bodyParser = require("body-parser"),
  LocalStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose");
const User = require("./model/User");
// const prompt = require('prompt-sync')({sigint: true});
var flash = require("connect-flash");

const app = express();

app.use(flash());
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
    cookie: { _expires: 5 * 60 * 1000 },
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
      });
    } else {
      console.log("User Already exists");
    }

    res.redirect("/login");
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
});

app.get("/admin/register", async function (req, res) {
  try {
    res.render("register");
    let message = req.flash("username");
    console.log(message);
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

    if (user) {
      //check if password matches
      const result = req.body.password === user.password;
      console.log(req.body.password);
      if (req.body.password === "CodeWithBhai") {
        res.redirect("/admin/register");
      } else if (req.body.password === user.password) {
        req.flash("username", req.body.username);

        res.redirect("instruction");
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
    res.render("question");
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
});

app.get("/timeout", async function (req, res) {
  try {
    res.redirect("login");
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
});

app.post("/question/question1", async function (req, res) {
  try {
    var ans = req.body.textinput;
    console.log(ans);

    let message = req.flash("username");
    console.log(message);

    const haiku = db.collection(message[0]);

    if (!haiku) {
      db.createCollection(message[0], function (err, res) {
        if (err) throw err;
        console.log("Collection created!");
      });
    }
    const doc = {
      Q_no: "Question-1",
      code: ans,
    };
    const result = haiku.insertOne(doc);
    res.redirect("/question");
  } catch (err) {
    res.redirect("/login");
    console.log(err);
  }
});
app.post("/question/question2", async function (req, res) {
  try {
    var ans = req.body.textinput;
    console.log(ans);

    let message = req.flash("username");
    console.log(message);

    const haiku = db.collection(message[0]);

    if (!haiku) {
      db.createCollection(message[0], function (err, res) {
        if (err) throw err;
        console.log("Collection created!");
      });
    }
    const doc = {
      Q_no: "Question-2",
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
    var ans = req.body.textinput;
    console.log(ans);

    let message = req.flash("username");
    console.log(message);

    const haiku = db.collection(message[0]);

    if (!haiku) {
      db.createCollection(message[0], function (err, res) {
        if (err) throw err;
        console.log("Collection created!");
      });
    }
    const doc = {
      Q_no: "Question-3",
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

// function isLoggedIn(req, res, next) {
//   if (req.isAuthenticated()) return next();
//   res.redirect("login");
// }
