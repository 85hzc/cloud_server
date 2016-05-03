var express = require('express');
var router = express.Router();
var pluginDao = require('../dao/pluginDao');
var equipmentDao = require('../dao/equipmentDao');

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  res.render('updatePlugin', {no : req.query.no});
});

router.get('/insertPlugin', function(req, res, next) {
    res.render('insertview');
});

router.get('/searchPlugin', function(req, res, next) {
    res.render('searchview');
});

router.get('/addPlugin', function(req, res, next) {
    pluginDao.add(req, res, next);
});

router.get('/deletePlugin', function(req, res, next) {
    pluginDao.delete(req, res, next);
});

router.post('/updatePlugin', function(req, res, next) {
    pluginDao.update(req, res, next);
});

router.get('/queryPluginById', function(req, res, next) {
    pluginDao.queryById(req, res, next);
});

router.get('/queryPluginAll', function(req, res, next) {
    pluginDao.queryAll(req, res, next);
});



router.get('/allEquipment', function(req, res, next) {
    equipmentDao.queryequipAll(req, res, next);
});

router.get('/queryEquipById', function(req, res, next) {
    equipmentDao.queryEquipById(req, res, next);
});

router.get('/updateEquipment', function(req, res, next) {
    equipmentDao.update(req, res, next);
});

router.get('/deleteEquipment', function(req, res, next) {
    equipmentDao.delete(req, res, next);
});

router.get('/installedPlugin', function(req, res, next) {
    equipmentDao.installedPlugin(req, res, next);
});

router.get('/installPluginList', function(req, res, next) {
    equipmentDao.installPluginList(req, res, next);
});

router.get('/installPlugin', function(req, res, next) {
    equipmentDao.installPlugin(req, res, next);
});

router.get('/uninstallPlugin', function(req, res, next) {
    equipmentDao.uninstallPlugin(req, res, next);
});

router.get('/equipServiceList', function(req, res, next) {
    equipmentDao.equipServiceList(req, res, next);
});

router.post('/setStartAndAutos', function(req, res, next) {
    equipmentDao.setStartAndAutos(req, res, next);
});


module.exports = router;
