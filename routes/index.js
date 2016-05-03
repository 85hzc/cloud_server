var express = require('express');
var router = express.Router();
var client_intf = require('client_intf');

/* GET home page. */
router.get('/', function(req, res, next) {
//  res.render('index', { title: 'Express' });
    res.render('welcome');
});

router.get('/content', function(req, res, next) {
  res.render('content');
});

router.get('/left', function(req, res, next) {
  res.render('left');
});


router.get('/top', function(req, res, next) {
  res.render('top');
});


router.get('/bottom', function(req, res, next) {
  res.render('bottom');
});

/* POST home page */

router.post('/', function(req, res, next) {

    
    console.log("Enter router.post");

    client_intf.client_packet_handler(req, res);

    console.log("Exit router.post");

});

module.exports = router;
