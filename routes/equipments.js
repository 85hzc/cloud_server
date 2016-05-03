var express = require('express');
var router = express.Router();
var equipmentDao = require('../dao/equipmentDao');

/* GET users listing. */
/*router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});*/




router.get('/allEquipment', function(req, res, next) {
    equipmentDao.queryAllEquipment(req, res, next);
});

router.get('/queryEquipView', function(req, res, next) {
  res.render('queryEquipView');
});

router.post('/queryEquipById', function(req, res, next) {
    equipmentDao.queryEquipById(req, res, next);
});

router.get('/updateEquipment', function(req, res, next) {
    equipmentDao.updateEquipment(req, res, next);
});

router.get('/deleteEquipment', function(req, res, next) {
    equipmentDao.deleteEquipment(req, res, next);
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

router.post('/setStartAndStatus', function(req, res, next) {
    equipmentDao.setStartAndStatus(req, res, next);
});


module.exports = router;
