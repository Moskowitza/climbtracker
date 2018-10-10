var express = require('express');
var router = express.Router();

// Require controller modules.
var climb_controller = require('../controllers/climbController');

// for our home page
router.get('/', climb_controller.index);

router.get('/climbs', climb_controller.climb_list);

module.exports = router;