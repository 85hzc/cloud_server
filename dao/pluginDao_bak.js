var pg = require('pg');
var $confconect = require('db');
var $sql = require('./pluginSqlMapping');
var multiparty = require('multiparty');
var fs = require('fs');


//向前台返回JSON的简单封装
var jsonWrite = function(res, ret) {
    if (typeof ret === 'undefined') {
        res.json({
            code : '1',
            msg : '操作失败'
        });
    } else {
        res.json(ret);
    }
};

function addPlugin(req, res, next)
{
}

module.exports = {
    addPlugin : function(req, res, next) {
/*
        var form = new multiparty.Form({uploadDir:'./uploads'});
        form.parse(req, function(err, fields, files) {
            var filesTmp = JSON.stringify(files, null, 2);
            if (err) {
                console.log('parser err:' + err);
            } else {
                console.log('parse files:' + filesTmp);
                console.log('fields: ' + JSON.stringify(fields));
                console.log('files: ' + JSON.stringify(files));
                var inputFile = files.filename[0];
                var uploadedPath = inputFile.path;
                var dstpath = './uploads/' + inputFile.originalFilename;
                fs.rename(uploadedPath, dstpath, function() {
                    if (err) {
                        console.log('rename err: ' + err);
                    } else {
                        console.log('rename ok');
                    }
                });
            }
*/
        console.log(req.body);
            pg.connect($confconect.consqlString, function(err, client, done){
                if (err) {
                    return console.error('error fetching client from pool', err);
                }
                console.log(fields);
                var plugname = fields.plugname + '';
                var plugdesc = fields.plugdesc + '';
                var vendorID = req.session.vendorID;

                var insert_string = "INSERT INTO plugin VALUES('"
                                  + vendorID + "','"
                                  + plugname + "','"
                                  + plugdesc
                                  + "')";

                console.log("insert_string");

                client.query($sql.insert, [plugname, plugdesc], function(err, result) {
                    if (result.rowCount > 0) {
                        result = {
                            code : 200,
                            msg : '增加成功'
                    };
                    } else {
                        jsonWrite(res, result);
                }
                    client.end();
                    res.redirect('/plugin/allPlugin');
                });
            });
        });
    },

    deletePlugin : function(req, res, next) {
        pg.connect($confconect.consqlString, function(err, client, done) {
            var plugname = req.query.plugname;
            client.query($sql.delete, [plugname], function(err, result) {
                if (result.rowCount > 0) {
                    result = {
                        code : 200,
                        msg : '删除成功'
                    };
                } else {
                    result = void 0;
                }
                client.end();
                res.redirect('/plugin/allPlugin');
            });
        });
    },

    

    updatePlugin : function(req, res, next) {
        var param = req.body;
        if (param.plugname == null || param.plugdesc == null) {
            jsonWrite(res, undefined);
            return;
        }
        console.log(param.plugname + "........." + param.plugdesc);
        pg.connect($confconect.consqlString, function(err, client, done) {
            client.query($sql.update, [param.plugdesc, param.plugname], function(err, result) {
                if (result.rowCount > 0) {
                    /*res.render('suc', {
                        result : result
                    });*/
                    res.redirect('/plugin/allPlugin');
                } else {
                    res.render('fail', {
                        result : result
                    });
                }
                console.log(result);
                client.end();
            });
        });
    },


    queryPluginByName : function(req, res, next) {
        var plugname = req.body.plugname;
        console.log(plugname);
        pg.connect($confconect.consqlString, function(err, client, done) {
            client.query($sql.queryByName, [plugname], function(err, result) {
                console.log(result);
                if (err){
                    res.render('fail', {
                        result : result
                    });
                } else {
                    res.render('querypluginresult', {
                        result : result
                    });
                }
                client.end();
            });
        });
    },



    queryAllPlugin : function(req, res, next) {
        console.log($confconect.consqlString);
        console.log($sql.queryAll);
        pg.connect($confconect.consqlString, function(err, client, done) {
            client.query($sql.queryAll, function(err, result) {
                //jsonWrite(res, result);
                console.log(result);
                if (err){
                    res.render('fail', {
                        result : result
                    });
                } else {
                    res.render('pluginlist', {
                        result : result
                    });
                }
                client.end();
            });
        });
    }

};
