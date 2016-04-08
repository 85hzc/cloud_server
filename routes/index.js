var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* POST home page */

router.post('/', function(req, res, next) {

    
    console.log("Enter router.post");

    client_intf.client_packet_handler(req, res);

    console.log("Exit router.post");

});

module.exports = router;
