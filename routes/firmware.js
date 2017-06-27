var express = require('express');
var router = express.Router();

var db = require('db');
var mkdirp = require('mkdirp');

var fs = require('fs');

var multer = require('multer');
var upload = multer({dest:"./public"});

var firmwareDao = require('../dao/firmwareDao');
var lircDao = require('../dao/lircDao');
var pluginDao = require('../dao/pluginDao');
var devDao = require('../dao/devDao');
var check = require('check');


//根据天数统计直播资源观看数
router.get('/queryresourcebyday', function(req, res, next) {
    console.log("/queryresourcebyday");

        firmwareDao.queryresourcebyday(req, res, next);



});

//total live num 
router.get('/totalsumByweek', function(req, res, next) {
    console.log("/totalsumByweek");

        firmwareDao.totalsumByweek(req, res, next);



});





//each month
router.get('/totalBytesBytime', function(req, res, next) {
    console.log("/totalBytesBytime");

        firmwareDao.totalBytesBytime(req, res, next);



});

//ench month by deviceId
router.post('/totalBytesBydeviceId', function(req, res, next) {
         console.log("/totalBytesBydeviceId");
        firmwareDao.totalBytesBydeviceId(req, res, next);
    
});





//查询所有路由器
router.get('/queryAllroute', function(req, res, next) {

    console.log("queryAllroute");
    
        firmwareDao.queryAllroute(req, res, next);

    
   
});


//查询当前
router.post('/querynowmsg', function(req, res, next) {
    
        firmwareDao.querynowmsg(req, res, next);
    
});

//查询历史
router.post('/queryhismsg', function(req, res, next) {
    
        firmwareDao.queryhismsg(req, res, next);
    
});


//当前直播资源
router.get('/queryAllnow', function(req, res, next) {
    
        lircDao.queryAllnow(req, res, next);
    
});

//当前直播资源详细
router.post('/queryById', function(req, res, next) {
    
        lircDao.queryById(req, res, next);
    
});






//历史直播资源详细 ok
router.get('/queryAllhistory', function(req, res, next) {
    
        pluginDao.queryAllhistory(req, res, next);
    
});



//总详情页面

router.get('/status', function(req, res, next) {
   
        devDao.stat(req, res, next);
    
});

















/*delete local file*/
router.post('/deleteFirmware', function(req, res, next) {
    if (req.session.hasLogined) {

        var path = db.file_save_dir + '/' + req.session.vendorName  + '/firmware/' 
            + req.body.firmwareId;

        check.file_delete(path);

    }
    else {
        res.render('login');
    }

    next();
});

router.post('/deleteFirmware', function(req, res, next) {
    if (req.session.hasLogined) {

        firmwareDao.deleteFirmware(req, res, next);
    }
    else {
        res.render('login');
    }
});

router.post('/deleteVersion', function(req, res, next) {
    if (req.session.hasLogined){

        var path = db.file_save_dir + '/' + req.session.vendorName  + '/firmware/' 
            + req.body.firmwareId + '/' + req.body.version; 

        check.file_delete(path);

    }
    else {
        res.render('login');
    }

    next();
});

router.post('/deleteVersion', function(req, res, next) {
    if (req.session.hasLogined) {

        firmwareDao.deleteVersion(req, res, next);
    }
    else {
        res.render('login');
    }
});

function moveFile(srcFile, dstFile, req, res) {
    var sf = fs.createReadStream(srcFile);
    var df = fs.createWriteStream(dstFile);

    sf.pipe(df);
    sf.on('end', function() {
        console.log("copy file end");
        fs.unlinkSync(srcFile);

        firmwareDao.addFirmwareVersion(req, res);
        
    });
    sf.on('error', function() {
        console.log("copy file error");

        var retStr = { ret: 1 };

        res.send(JSON.stringify(retStr));

    });

};

router.post('/fileupload', upload.single('thumbnail'), function(req, res, next) {
    console.log(req.file);
    console.log(req.body);
    console.log(req.session.hasLogined);
    console.log(req.session.vendorID);
    console.log(req.session.vendorName);

    var tmpFile = req.file.path;
    var targetDir = db.file_save_dir + '/' + req.session.vendorName  + '/firmware/' 
            + req.body.firmwareId + '/' + req.body.version;

    var targetFile = targetDir + '/' + req.file.originalname;

    console.log(tmpFile);
    console.log(targetFile);

    fs.exists(targetDir, function(exists) {
        if (exists) {
            moveFile(tmpFile, targetFile, req, res);
        }
        else {
            mkdirp(targetDir, function(err) {
                if (err) {
                    console.error(err);
                }
                else {
                    moveFile(tmpFile, targetFile, req, res);
                }
            });
        }
    });

});

router.post('/queryFirmwareVersion', function(req, res, next) {
    if (req.session.hasLogined) {

        firmwareDao.queryFirmwareVersion(req, res, next);
    }
    else {
        res.render('login');
    }
});

router.post('/publishVersion', function(req, res, next) {
    if (req.session.hasLogined) {

        firmwareDao.publishVersion(req, res, next);
    }
    else {
        res.render('login');
    }
});

router.post('/queryFirmware', function(req, res, next) {
    if (req.session.hasLogined) {

        firmwareDao.queryFirmware(req, res, next);
    }
});

/*检测版本号是否存在*/
router.post('/firmwareVersionIsOk', function(req, res, next) {
    if (req.session.hasLogined) {

        firmwareDao.firmwareVersionIsOk(req, res, next);
    }else {
        res.render('login');
    }
});

module.exports = router;
