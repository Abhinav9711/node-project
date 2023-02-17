const express = require('express');
const router = express.Router();

const { createUser, signInUser } = require('../controller/userController');

router.route("/signup").post(createUser);
router.route('/signin').post(signInUser);

module.exports = router