
var express = require('express');
var router = express.Router();
var crypto = require('crypto');

var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var wechat = require('wechat');
var socket_arr = require('socket_arr');
var wechat_priv = require('wechat_priv');
var gateway_priv = require('gateway_priv');
var user_intf = require('user_intf');
var check        = require('check');
var weixin_socket_arr    = new Array();
var gateway_socket_arr = new Array(); 


var config = {
    token : 'weixin',
    appid : 'wx99757248d6d899b2',
    encodingAESKey: 'PIVeuPx0v1naPdWUoWti2wLcaUiZY6LO4dhYxnTjAFd'
};

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("aaa");
    /*
    if (req.session.hasLogined)
    {
        res.render('welcome');
    }
    else */
    {
        console.log('bbb');
        res.render('login');
    }
//  res.render('index', { title: 'Express' });
});

router.get('/register_page', function(req, res, next) {
    console.log('bbb');
    res.render('register_page');
});




router.get('/wx_things', function(req, res, next) {
  console.log("enter post /wx_things");
  res.render('index', { title: 'Express' });
});



router.get('/weixin', function(req, res, next) {
  console.log("Enter weixin"); 
  console.log(req.query);
  res.render('index', { title: 'Express' });
});

//router.post()
router.post('/weixin', wechat(config, function(req, res, next) 
{
    wechat_priv.message_handle(req, res);
//    res.render('index', { title: 'Express' });
}));

router.post('/gateway', function(req, res, next) 
{
    gateway_priv.message_handle(req, res);
//    res.render('index', { title: 'Express' });
});


router.post('/user_intf', function(req, res, next) 
{
    console.log(req.body);
    user_intf.message_handle(req, res);
//    res.render('index', { title: 'Express' });
});


router.post('/register_page', function(req, res, next) {
    console.log('post register_page');
    console.log(req.body);    
    
    var username = req.body.username;
    var password = req.body.password;

    check.check_register("common_register", username, password, res);
    
});

router.post('/register_check/username', function(req, res, next) {
    console.log('post check_username');
    console.log(req.body);
    
    check.check_input("username", req, res);    
});

router.post('/login', function(req, res, next) {
    console.log('post login');
    console.log(req.body);        
    var username = req.body.username;
    var password = req.body.password;

    check.check_login("common_login", username, password, res);    
});

module.exports = router;
