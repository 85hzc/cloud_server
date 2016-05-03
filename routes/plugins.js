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
    pluginDao.queryAllPlugin(req, res, next);
});

router.get('/addPluginView', function(req, res, next) {
    res.render('addpluginview');
});

router.post('/addPlugin', function(req, res, next) {
    pluginDao.addPlugin(req, res, next);
});

router.get('/deletePlugin', function(req, res, next) {
    pluginDao.deletePlugin(req, res, next);
});

router.get('/updatePluginView', function(req, res, next) {
    res.render('updatepluginview', {plugname : req.query.plugname, plugdesc : req.query.plugdesc});
});

router.post('/updatePlugin', function(req, res, next) {
    pluginDao.updatePlugin(req, res, next);
});


router.get('/queryPluginByNameView', function(req, res, next) {
    res.render('querypluginview');
});

router.post('/queryPluginByName', function(req, res, next) {
    pluginDao.queryPluginByName(req, res, next);
});


module.exports = router;
