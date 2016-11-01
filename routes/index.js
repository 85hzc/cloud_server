
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
var app = require('app');
var user = require('user');
var check        = require('check');
var session_priv = require('session_priv');

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


    if ( 1 != session_priv.check(req, res))
    {
        return;
    }
    
    res.render('welcome');
    
   
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

router.get('/content', function(req, res, next) {

    if ( 1 != session_priv.check(req, res))
    {
        return;
    }
    
    res.render('content');

});

router.get('/left', function(req, res, next) {

    if ( 1 != session_priv.check(req, res))
    {
        return;
    }

    res.render('left');

});


router.get('/top', function(req, res, next) {

    if ( 1 != session_priv.check(req, res))
    {
        return;
    }

    res.render('top');
});


router.get('/bottom', function(req, res, next) {

    if ( 1 != session_priv.check(req, res))
    {
        return;
    }

    res.render('bottom');

});

router.get('/quit', function(req, res, next) {
  if (req.session.hasLogined) {
      req.session.hasLogined = null;
      req.session.vendorID = null;
      req.session.vendorName = null;
  }
  res.render('login');
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

router.post('/app', function(req, res, next) 
{
    console.log(req.body);
    app.message_handle(req, res);
//    res.render('index', { title: 'Express' });
});

router.post('/user', function(req, res, next)
{
    console.log(req.body);
    user.register(req, res);
});

router.post('/user/login', function(req, res, next)
{
    console.log(req.body);
    user.login(req, res);
});


router.post('/register_page', function(req, res, next) {
    console.log('post register_page');
    console.log(req.body);    
    
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
  
    check.check_register("vendor_register", username, password, email, req, res);
    
});

router.post('/register_check/username', function(req, res, next) {
    console.log('post check_username');
    console.log(req.body);
    
    check.check_input("username", req, res);    
});


router.post('/register_check/vendor_id', function(req, res, next) {

    console.log('post vendor_id');
    console.log(req.body);    
    check.check_input("vendor_id", req, res);    
});

router.post('/login', function(req, res, next) {
    console.log('post login');
    console.log(req.body);        
    var username = req.body.username;
    var password = req.body.password;

    check.check_login("vendor_login", username, password, req, res);    
});

module.exports = router;
