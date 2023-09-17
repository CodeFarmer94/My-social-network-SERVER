
const router = require('express').Router();
const { login } = require('../services/loginServices')

module.exports = (passport) => {
    router.post('/',
    passport.authenticate('local'), login)
    return router;
  };
