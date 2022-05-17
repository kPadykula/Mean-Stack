
const express = require('express');
const passwordReset = require("../controllers/resetPassword");
const router = express.Router();

router.post("/", passwordReset.createToken);
router.patch("/:userId/:token", passwordReset.resetPassword);

module.exports = router;
