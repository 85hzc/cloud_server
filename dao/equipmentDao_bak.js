var pg = require('pg');
var $confconect = require('../conf/db');

var EventEmitter = require('events').EventEmitter;
var evt = new EventEmitter();


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
    
    /*add : function(req, res, next) {
        var param = req.query || req.params;
        pg.connect($confconect.consqlString, function(err, client, done){
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            //client.query($sql.insert, [param.no, param.name], function(err, result) {
            client.query("INSERT INTO tblequipment(equipmac, equipdesc) VALUES($1, $2)", [param.equipmac, param.equipdesc], function(err, result) {
                if (result) {
                    result = {
                        code : 200,
                        msg : '增加成功'
                    };
                }
                client.end();
            });
        });
    },*/

    addEquipment : function(data) {
        var param = data;
        pg.connect($confconect.consqlString, function(err, client, done){
            client.query("INSERT INTO tblequipment(equipmac) VALUES($1)", [param], function(err, result) {
                if (result) {
                    result = {
                        code : 200,
                        msg : '增加成功'
                    };
                }
                client.end();
            });
        });
    },

    deleteEquipment : function(req, res, next) {
        pg.connect($confconect.consqlString, function(err, client, done) {
            var sn = req.query.sn;
            console.log(sn);
            client.query("delete from tblequipment where sn=$1", [sn], function(err, result) {
                if (result.rowCount > 0) {
                    result = {
                        code : 200,
                        msg : '删除成功'
                    };
                } else {
                    result = void 0;
                }
                console.log(result);
                //jsonWrite(res, result);
                client.end();
                res.redirect("/equipment/allEquipment");
            });
        });
    },

    installedPlugin : function(req, res, next) {
        var sn = req.query.sn;
        var results;
        pg.connect($confconect.consqlString, function(err, client, done) {
            console.log("install plugin");
            client.query("select * from tblequipmentplugin where sn=$1", [sn], function(err, result) {
                //jsonWrite(res, result);
                
//                console.log(result);
               if (err){
                    res.render('fail', {
                        result : result
                    });
                } else {
                    res.render('equipinstalledplugin', {
                        result : result,
                        sn : sn
                    });
                }
                console.log("**********");
                //jsonWrite(res, result);
                client.end();
            });
        });
    },


    installPluginList : function(req, res, next) {
        var sn = req.query.sn;
        pg.connect($confconect.consqlString, function(err, client, done) {
            client.query("select * from tblplugin where plugname not in(select plugname from tblequipmentplugin where sn=$1)", 
                [sn], function(err, result) {
                //jsonWrite(res, result);
  //              console.log(result);
                if (err){
                    res.render('fail', {
                        result : result
                    });
                } else {
                    res.render('equipinstallplugin', {
                        result : result,
                        sn : sn
                    });
                }
                client.end();
            });
        });
    },


    installPlugin : function(req, res, next) {
        var sn = req.query.sn;
        var plugname = req.query.plugname;
        pg.connect($confconect.consqlString, function(err, client, done) {
            client.query("insert into tblequipmentplugin values($1, $2)", [sn, plugname], function(err, result) {
                //jsonWrite(res, result);
                console.log(result);
                if (err){
                    res.render('fail', {
                        result : result
                    });
                }/* else {
                    res.render('equipmentlist', {
                        result : result
                    });
                }*/
                client.end();
                res.redirect("/equipment/installedPlugin/?sn=" + sn);
            });
        });
    },



    uninstallPlugin : function(req, res, next) {
        var sn = req.query.sn;
        var plugname = req.query.plugname;
        pg.connect($confconect.consqlString, function(err, client, done) {
            client.query("delete from tblequipmentplugin where sn=$1 and plugname=$2", [sn, plugname], function(err, result) {
                //jsonWrite(res, result);
    //            console.log(result);
                if (err){
                    res.render('fail', {
                        result : result
                    });
                }/* else {
                    res.render('equipmentlist', {
                        result : result
                    });
                }*/
                client.end();
                res.redirect("/equipment/installedPlugin/?sn=" + sn);
            });
        });
    },


    equipServiceList : function(req, res, next) {
        var sn = req.query.sn;
        pg.connect($confconect.consqlString, function(err, client, done) {
            client.query("select * from tblequipmentservice where sn=$1", [sn], function(err, result) {
                //jsonWrite(res, result);
                console.log(result);
                if (err){
                    res.render('fail', {
                        result : result
                    });
                } else {
                    res.render('equipservicelist', {
                        result : result,
                        sn : sn
                    });
                }
                client.end();
            });
        });
    },


    setStartAndStatus : function(req, res, next) {
        var autostartData = JSON.parse(req.body.autostartData);
        var sstatusData = JSON.parse(req.body.sstatusData);
        var sn = req.body.sn;
        console.log("777777777777777777");
        console.log(sn);
        var sql = "";
        var key;
        for(key in autostartData){
            sql += "update tblequipmentservice set autostart=" + autostartData[key] + " where sn='" + sn + "' and servicename='" + key + "';";
        }
        
        for(key in sstatusData){
            sql += "update tblequipmentservice set servicestatus=" + sstatusData[key] + " where sn='" + sn + "' and servicename='" + key + "';";
        }

        console.log("11111111111111111111" + sql);
        pg.connect($confconect.consqlString, function(err, client, done) {
            client.query(sql, function(err, result) {
                //jsonWrite(res, result);
                console.log(result);
                if (err){
                    res.render('fail', {
                        result : result
                    });
                } else {
                    jsonWrite(res, result);
                    //res.render('equipservicelist', {
                        //result : result,
                        //equipmac : equipmac
                    //});
                }
                client.end();
                //jsonWrite(res, { "a":"b"});
            });
        });
    },


/*
    update : function(req, res, next) {
        var param = req.body;
        if (param.name == null || param.no == null) {
            jsonWrite(res, undefined);
            return;
        }

        console.log(param.name + "***********" + param.no);
        pg.connect($confconect.consqlString, function(err, client, done) {
            client.query($sql.update, [param.name, param.no], function(err, result) {
                if (result.rowCount > 0) {
                    res.render('suc', {
                        result : result
                    });
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


    queryById : function(req, res, next) {
        var no = req.query.no;
        pg.connect($confconect.consqlString, function(err, client, done) {
            client.query($sql.queryById, no, function(err, result) {
                //jsonWrite(res, result);
                
                console.log(result);
                if (err){
                    res.render('fail', {
                        result : result
                    });
                } else {
                    res.render('searchresult', {
                        result : result
                    });
                }
                client.end();
            });
        });
    },

*/


    /*test
    queryAllEquipment : function(req, res, next) {
        pg.connect($confconect.consqlString, function(err, client, done) {
            client.query("select * from test where id='bbb';", function(err, result) {
                //jsonWrite(res, result);
                //console.log(result);
                if (err){
                    res.render('fail', {
                        result : result
                    });
                } else {
                    res.render('test', {
                        result : result
                    });
                }
                client.end();
            });
        });
    },*/
/*
    queryAllEquipment : function(req, res, next) {
        var pagesize = req.query.pagesize || 15;
        var pagecount = 0;
        var pagecurrent = req.query.pagecurrent || 1;
        var pageoffset = (pagecurrent - 1) * pagesize;
        pg.connect($confconect.consqlString, function(err, client, done) {
            client.query("select * from tblequipment limit $1 offset $2;", [pagesize, pageoffset], function(err, result) {
                //jsonWrite(res, result);
                //console.log(result);
                evt.emit('wan', {data : result});
                if (err){
                    res.render('fail', {
                        result : result
                    });
                } else {
                    res.render('equipmentlist', {
                        result : result
                    });
                }
                client.end();
            });
        });
        evt.on('wan', function(data) {
            console.log(data);
        });
    },
*/
    queryAllEquipment : function(req, res, next) {
        var pagesize = req.query.pagesize || 15;
        var pagecount = 0;
        var pagecurrent = req.query.pagecurrent || 1;
        var pageoffset = (pagecurrent - 1) * pagesize;
        pg.connect($confconect.consqlString, function(err, client, done) {
            client.query("select count(*) from tblequipment;", function(err, result) {
            console.log("Enter queryAllEquipment");
      //          console.log(result);
                if (err){
                    res.render('fail', {
                        result : result
                    });
                } else {
                    var count = result.rows[0].count;
                    if (count > 0) {
                        pagecount = Math.ceil(count/pagesize)
                    } else {
                        pagecount = 0;
                    }
                    if (0 == count) {
                        res.render('equipmentlist', {
                            result : {rowcount:0}
                        });
                        client.end();
                    } else {
                        client.query("select * from tblequipment limit $1 offset $2;", [pagesize, pageoffset], function(err, result2) {
                         //   console.log(result2);
                         //   console.log('nihaoooooooooooo');
                            if (err) {
                                res.render('fail', {
                                    result : result
                                });
                            } else {
                                console.log(pagecount);
                                console.log("******************");
                                res.render('equipmentlist', {
                                    result : result2,
                                    pagecount : pagecount,
                                    pagecurrent : pagecurrent,
                                    startSeriaNum : pageoffset
                                });
                                client.end();
                            }
                        });
                    }
                }
                    /*res.render('equipmentlist', {
                        result : result
                    });*/
            });
        });
    },

    queryEquipById : function(req, res, next) {
        var sn = req.body.sn;
        console.log(sn);
        pg.connect($confconect.consqlString, function(err, client, done) {
            client.query("select * from tblequipment where sn=$1", [sn], function(err, result) {
                //jsonWrite(res, result);
        //        console.log(result);
                if (err){
                    res.render('fail', {
                        result : result
                    });
                } else {
                    res.render('queryEquipResult', {
                        result : result
                    });
                }
                client.end();
            });
        });
    }

};
