const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

/* POST user creation */
router.post('/create', UserController.createUser);

/* POST user login*/
router.post('/login', UserController.authUser);

router.get('/info', UserController.getInfo);

module.exports = router;
