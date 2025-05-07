if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const rateLimit = require("express-rate-limit");

var app = express();

// Rate limiters
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // IP başına maksimum istek sayısı
  message: {
    status: "error",
    message: "Çok fazla istek gönderdiniz, lütfen daha sonra tekrar deneyin.",
  },
  standardHeaders: true, // Rate limit bilgilerini header'larda göster
  legacyHeaders: false, // Eski header formatını kullanma
});

// Auth endpoint'leri için özel limiter
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 saat
  max: 5, // IP başına maksimum istek sayısı
  message: {
    status: "error",
    message: "Çok fazla giriş denemesi yaptınız, lütfen 1 saat sonra tekrar deneyin.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// view engine setup
// views: HTML şablonlarının bulunduğu klasörü ayarlar (views klasörü).
// EJS motoru kullanılarak .ejs uzantılı dinamik HTML sayfaları üretileceğini belirtir.
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Her HTTP isteğini konsol üzerinde loglar
//application/json olarak gelen istek gövdesini req.body'ye parse eder
//form verilerini parse eder (x-www-form-urlencoded)
//İsteklerdeki cookie’leri req.cookies içine parse eder
//public klasörünü statik dosyalar (CSS, JS, resimler) için kullanır
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Global rate limiter'ı tüm isteklere uygula
app.use(globalLimiter);

// OTOMATİK ROUTE TANIMLAMA YAPISI
// app.use("/api", require("./routes/index"));

// MANUEL ROUTE TANIMLAMA YAPISI
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const serviceRoutes = require("./routes/service");
const appoinstmentsRoutes = require("./routes/appoinstments");

// Auth endpoint'lerine özel rate limiter uygula
app.use("/api/auth", authLimiter, authRoutes); // giriş, kayıt vb.
app.use("/api/users", userRoutes); // kullanıcı işlemleri
app.use("/api/service", serviceRoutes);
app.use("/api/appoinstments", appoinstmentsRoutes);

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
