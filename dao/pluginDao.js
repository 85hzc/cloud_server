var pg = require('pg');
var $confconect = require('../conf/db');
var $sql = require('./pluginSqlMapping');


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


module.exports = {
    addPlugin : function(req, res, next) {
        var param = req.boby || req.body;
        pg.connect($confconect.consqlString, function(err, client, done){
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query($sql.insert, [param.plugname, param.plugdesc], function(err, result) {
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
