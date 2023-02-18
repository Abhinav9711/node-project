const express = require('express');
const router = express.Router();

const { createUser, signInUser, checkConnection } = require('../controller/userController');

router.route("/signup").post(createUser);
router.route('/signin').post(signInUser);
router.route('/connection').get(checkConnection);

module.exports = router