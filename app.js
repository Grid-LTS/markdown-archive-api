import createError from "http-errors";
import express from "express";
import path from "path";
import logger from "morgan";
import indexRouter from "./routes/index";
import api from "./routes/api";
//var usersRouter = require('./routes/users');

let app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Access control headers to circumvent CORS
app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");
  console.log("test");
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

// Specify application routes
app.use("/", indexRouter);
app.get("/api/list/:path", api.list);
app.get("/api/mddirs", api.mddirs);
//app.get('/api/list/:path', api.listpath);

//app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // send the error (without rendering)
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: err
  });
});

app.listen(3000);
