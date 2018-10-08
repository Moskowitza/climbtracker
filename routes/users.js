var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
  res.redirect('/climbs');
    // res.render('catalog', { user : req.user });
});

module.exports = router;
