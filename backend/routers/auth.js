const express = require('express');
const auth = require('../controllers/auth')


const router = express.Router();

router.post("/signup", auth.createUser);

router.post("/login", auth.loginUser);

module.exports = router;
