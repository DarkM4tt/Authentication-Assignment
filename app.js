const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const bodyParser = require('body-parser')
const LocalStrategy = require('passport-local')
const passportLocalMongoose = require('passport-local-mongoose')
const User = require('./models/user')

mongoose.connect('mongodb://localhost/auth_demo_app', {}, function (err) {
  console.log(err)
})

const PORT = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

app.use(
  require('express-session')({
    secret: 'Mary had a little lamb',
    resave: false,
    saveUninitialized: false,
  })
)

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.get('/', function (req, res) {
  res.render('welcome')
})

app.get('/home', isLoggedIn, function (req, res) {
  res.render('home')
})

app.get('/register', function (req, res) {
  res.render('register')
})

app.post('/register', function (req, res) {
  req.body.username
  req.body.password
  User.register(
    new User({
      username: req.body.username,
    }),
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err)
        return res.render('register')
      }
      passport.authenticate('local')(req, res, function () {
        res.redirect('/secret')
      })
    }
  )
})

app.get('/login', function (req, res) {
  res.render('login')
})

app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
  }),
  function (req, res) {
    console.log(res)
  }
)

app.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/login')
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

app.listen(PORT, function () {
  console.log('server started')
})
