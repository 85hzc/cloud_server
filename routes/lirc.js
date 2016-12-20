var express = require('express');
var router = express.Router();

var db = require('db');
var mkdirp = require('mkdirp');

var fs = require('fs');
var multer = require('multer');
var upload = multer({dest:"./public"});

var lircDao = require('../dao/lircDao');
var check = require('check');


function moveFile(srcFile, dstFile, req, res) {
    var sf = fs.createReadStream(srcFile);
    var df = fs.createWriteStream(dstFile);

    sf.pipe(df);
    sf.on('end', function() {
        console.log("copy file end");
        fs.unlinkSync(srcFile);

        lircDao.updateCode(req, res);
        
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
    var targetDir = db.file_save_dir + '/' + req.session.vendorName  + '/lirc/' 
            + req.body.version;

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


router.post('/delete', function(req, res, next) {
    if (req.session.hasLogined) {

        var path = db.file_save_dir + '/' + req.session.vendorName
                + "/lirc/" + req.body.version;

        check.file_delete(path);

        next();
    }

});

router.post('/delete', function(req, res, next) {
    if (req.session.hasLogined) {
        lircDao.deleteCode(req, res, next);
    }
});


router.get('/allCode', function(req, res, next) {
    if (req.session.hasLogined) {
        lircDao.queryAllCode(req, res, next);
    }
});

router.post('/allDev', function(req, res, next) {
    if (req.session.hasLogined) {
        lircDao.queryAllDev(req, res, next);
    }
});

router.post('/devDelete', function(req, res, next) {
    if (req.session.hasLogined) {
        lircDao.deleteDev(req, res, next);
    }
});

router.post('/devAdd', function(req, res, next) {
     if (req.session.hasLogined) {
        lircDao.addDev(req, res, next);
    }
});

router.get('/lircCtl', function(req, res, next) {
    if (req.session.hasLogined) {
        res.render('lircCtl');
    }
    else {
        res.render('login');
    }
});

module.exports = router;
