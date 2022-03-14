const path = require("path"); //- helps with path management
const express = require("express"); //- main app framework
const morgan = require("morgan"); //- logger

const rateLimit = require("express-rate-limit"); //- DDOS protection
const helmet = require("helmet"); //XSS and not only protection
const mongoSanitize = require("express-mongo-sanitize"); //protection from query injection
const xss = require("xss-clean"); //XSS protection
const hpp = require("hpp"); //protect against HTTP Parameter Pollution attacks

const cookieParser = require("cookie-parser"); //- allows app to work with cookies
// const AppError = require('./utils/appError'); //- this is custom error handler, not for now
// const globalErrorHandler = require('./controllers/errorController');

const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());
// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);
// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());
// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);
// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});
// 3) ROUTES
// app.use('/', some router);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// app.use(globalErrorHandler);

module.exports = app;
