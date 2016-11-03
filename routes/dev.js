var express = require('express');
var router = express.Router();

var db = require('db');
var mkdirp = require('mkdirp');

var fs = require('fs');

var multer = require('multer');
var upload = multer({dest:"./public"});

var devDao = require('../dao/devDao');
var check = require('check');


function moveFile(srcFile, dstFile, req, res) {
    var sf = fs.createReadStream(srcFile);
    var df = fs.createWriteStream(dstFile);

    sf.pipe(df);
    sf.on('end', function() {
        console.log("copy file end");
        fs.unlinkSync(srcFile);

        devDao.updateDataModel(req, res);
        
    });
    sf.on('error', function() {
        console.log("copy file error");

        var retStr = { ret: 1 };

        res.send(JSON.stringify(retStr));

    });

};

router.post('/addDataModel', function(req, res, next) {
    if (req.session.hasLogined) {
        devDao.addDataModel(req, res, next);
    }    
});

router.post('/fileupload', upload.single('thumbnail'), function(req, res, next) {
    console.log(req.file);
    console.log(req.body);
    console.log(req.session.hasLogined);
    console.log(req.session.vendorID);
    console.log(req.session.vendorName);

    var tmpFile = req.file.path;
    var targetDir = db.file_save_dir + '/' + req.session.vendorName  + '/datamodel/' 
            + req.body.dataModelId;

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


router.post('/deleteDataModel', function(req, res, next) {
    if (req.session.hasLogined) {

        var path = db.file_save_dir + '/' + req.session.vendorName
                + "/datamodel/" + req.body.dataModelId;

        check.file_delete(path);

        next();
    }

});

router.post('/deleteDataModel', function(req, res, next) {
    if (req.session.hasLogined) {
        devDao.deleteDataModel(req, res, next);
    }    
});


router.get('/dataModel', function(req, res, next) {
    if (req.session.hasLogined) {
        res.render('datamodel');
    }
    else {
        res.render('login');
    }
});

module.exports = router;
