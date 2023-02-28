var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var userRouter = require("./routes/users");
var adminRouter = require("./routes/admin");
const { engine: hbs } = require("express-handlebars");
var app = express();
var fileupload=require("express-fileupload");
var session = require('express-session'); //express session
var db=require('./DATABASE/connection');
const { Cookie } = require("express-session");
const colours =require('colors')

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");


app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layout/",
    partialsDir: __dirname + "/views/partials/",
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use('/style',express.static(path.join(__dirname, "public/stylesheet")));
app.use('/Common',express.static(path.join(__dirname, "public/stylesheet")));
app.use(fileupload())
app.use(session({secret:"key",cookie:{maxAge:60000}}))    //express session difine is automatic logout user
db.connect((err)=>{          //databse Connection
   if(err) console.log("connection errr"+err)
   else console.log("Database Connected Port 3000".bgGreen.bold)
});


app.use("/", userRouter);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

