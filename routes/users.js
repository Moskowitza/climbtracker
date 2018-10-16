var express = require('express');
var router = express.Router();
var climb_controller = require('../controllers/userController');


router.get('/login', user_controller.user_login);
router.get('/register', user_controller.get_login);
router.post('/register', user_controller.post_login);

module.exports = router;
