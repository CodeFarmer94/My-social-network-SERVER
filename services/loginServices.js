const { model } = require("../model/model")
const passport = require('passport');


const login =  (req, res) => {
   
    res.set("Access-Control-Allow-Origin", "http://localhost:3000");
    res.set("Access-Control-Allow-Credentials", "true");
    // Passport middleware will set req.user and req.isAuthenticated
    res.status(200).json({ message: "You logged in" });
  }

const logout = (req, res) => {
    req.logout();
    res.status(200).json({ message: "You logged out" });
  }

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ error: "You are not authenticated" });
  }
module.exports = { login, logout, isAuthenticated }