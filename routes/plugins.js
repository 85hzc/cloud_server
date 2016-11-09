var express = require('express');
var router = express.Router();

var db = require('db');
var mkdirp = require('mkdirp');

var fs = require('fs');
var multer = require('multer');

var upload = multer({dest:"./public"});

var pluginDao = require('../dao/pluginDao');
var equipmentDao = require('../dao/equipmentDao');

var check = require('check');

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
router.get('/addPlugin', function(req, res, next) {
    console.log("Enter allPlugin");
    if (req.session.hasLogined) {
        res.render('addplugin');
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

/*delete local file*/
router.post('/deletePlugin', function(req, res, next) {
    if (req.session.hasLogined){

        var path = db.file_save_dir + '/' + req.session.vendorName  + '/plugin/' 
            + req.body.pluginId;

        check.file_delete(path);

    }
    else {
        res.render('login');
    }

    next();
});

router.post('/deletePlugin', function(req, res, next) {
    if (req.session.hasLogined) {

        pluginDao.deletePlugin(req, res, next);
    }
    else {
        res.render('login');
    }
});

router.post('/deleteVersion', function(req, res, next) {
    if (req.session.hasLogined){

        var path = db.file_save_dir + '/' + req.session.vendorName  + '/plugin/' 
            + req.body.pluginId + '/' + req.body.version; 

        check.file_delete(path);

    }
    else {
        res.render('login');
    }

    next();
});

router.post('/deleteVersion', function(req, res, next) {
    if (req.session.hasLogined) {

        pluginDao.deleteVersion(req, res, next);
    }
    else {
        res.render('login');
    }
});

router.post('/queryPluginVersion', function(req, res, next) {
    if (req.session.hasLogined) {

        pluginDao.queryPluginVersion(req, res, next);
    }
    else {
        res.render('login');
    }
});

router.post('/publishVersion', function(req, res, next) {
    if (req.session.hasLogined) {

        pluginDao.publishVersion(req, res, next);
    }
    else {
        res.render('login');
    }
});

router.post('/queryPluginById', function(req, res, next) {
    if (req.session.hasLogined) {

        pluginDao.queryPluginById(req, res, next);
    }
    else {
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

router.get('/fileupload', function(req, res, next) {
    res.render('fileupload');
});

function moveFile(srcFile, dstFile, req, res) {
    var sf = fs.createReadStream(srcFile);
    var df = fs.createWriteStream(dstFile);

    sf.pipe(df);
    sf.on('end', function() {
        console.log("copy file end");
        fs.unlinkSync(srcFile);

        pluginDao.addPluginVersion(req, res);
        
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
    var targetDir = db.file_save_dir + '/' + req.session.vendorName  + '/plugin/' 
            + req.body.pluginId + '/' + req.body.version;

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

module.exports = router;
