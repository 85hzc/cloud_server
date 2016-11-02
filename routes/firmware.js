var express = require('express');
var router = express.Router();

var db = require('db');
var mkdirp = require('mkdirp');

var fs = require('fs');

var multer = require('multer');
var upload = multer({dest:"./public"});

var firmwareDao = require('../dao/firmwareDao');
var check = require('check');

router.get('/allFirmware', function(req, res, next) {
    if (req.session.hasLogined) {
        firmwareDao.queryAllFirmware(req, res, next);
    }
    else {
        res.rendor('login');
    }
});

router.post('/addFirmware', function(req, res, next) {
    if (req.session.hasLogined) {
        firmwareDao.addFirmware(req, res, next);
    } else {
        res.render('login');
    }
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

        pluginDao.queryFirmwareVersion(req, res, next);
    }
    else {
        res.render('login');
    }
});

module.exports = router;
