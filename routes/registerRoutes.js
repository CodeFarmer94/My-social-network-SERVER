const router = require('express').Router();

const { register } = require('../services/registerServices')

router.post('/', register)

module.exports = router;