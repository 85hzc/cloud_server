var express = require('express');
var router = express.Router();


var pluginDao = require('../dao/pluginDao');
var equipmentDao = require('../dao/equipmentDao');

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  res.render('updatePlugin', {no : req.query.no});
});

router.get('/allPlugin', function(req, res, next) {
    console.log("Enter allPlugin");
    if (req.session.hasLogined) {
        pluginDao.queryAllPlugin(req, res, next);
    } else {
      res.render('login');
    }
});

router.get('/addPluginView', function(req, res, next) {
    console.log(req.session.vendorID);
    if (req.session.hasLogined) {
        res.render('addpluginview');
    } else {
        res.render('login');
    } 
});

router.post('/addPlugin', function(req, res, next) {
    console.log('aaaaaaaadddddd');
    if (req.session.hasLogined) {
        pluginDao.addPlugin(req, res, next);
    } else {
        res.render('login');
    }
});

router.get('/deletePlugin', function(req, res, next) {
    if (req.session.hasLogined) {
        pluginDao.deletePlugin(req, res, next);
    } else {
        res.render('login');
    }
});

router.get('/updatePluginView', function(req, res, next) {
    res.render('updatepluginview', {plugname : req.query.plugname, plugdesc : req.query.plugdesc});
});

router.post('/updatePlugin', function(req, res, next) {
    if (req.session.hasLogined) {
        pluginDao.updatePlugin(req, res, next);
    } else {
        res.render('login');
    }
});


router.get('/queryPluginByNameView', function(req, res, next) {
    if (req.session.hasLogined) {
        res.render('querypluginview');
    } else {
        res.render('login');
    }
});

router.post('/queryPluginByName', function(req, res, next) {
    if (req.session.hasLogined) {
        pluginDao.queryPluginByName(req, res, next);
    } else {
        res.render('login');
    }
});


module.exports = router;
