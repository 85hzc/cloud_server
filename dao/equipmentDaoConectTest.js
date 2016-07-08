var pg = require('pg');
var $confconect = require('db');

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

var client = new pg.Client($confconect.consqlString);
client.connect();

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
/*
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
            var equipmac = req.query.equipmac;
            console.log(equipmac);
            client.query("delete from tblequipment where equipmac=$1", [equipmac], function(err, result) {
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
        var equipmac = req.query.equipmac;
        var results;
        pg.connect($confconect.consqlString, function(err, client, done) {
            client.query("select * from tblequipmentplugin where equipmac=$1", [equipmac], function(err, result) {
                //jsonWrite(res, result);
                
                console.log(result);
               if (err){
                    res.render('fail', {
                        result : result
                    });
                } else {
                    res.render('equipinstalledplugin', {
                        result : result,
                        equipmac : equipmac
                    });
                }
                console.log("**********");
                //jsonWrite(res, result);
                client.end();
            });
        });
    },


    installPluginList : function(req, res, next) {
        var equipmac = req.query.equipmac;
        pg.connect($confconect.consqlString, function(err, client, done) {
            client.query("select * from tblplugin where plugname not in(select plugname from tblequipmentplugin where equipmac=$1)", 
                [equipmac], function(err, result) {
                //jsonWrite(res, result);
                console.log(result);
                if (err){
                    res.render('fail', {
                        result : result
                    });
                } else {
                    res.render('equipinstallplugin', {
                        result : result,
                        equipmac : equipmac
                    });
                }
                client.end();
            });
        });
    },

*/
  /*  installPlugin : function(req, res, next) {
        var equipmac = req.query.equipmac;
        var plugname = req.query.plugname;
        pg.connect($confconect.consqlString, function(err, client, done) {
            client.query("insert into tblequipmentplugin values($1, $2)", [equipmac, plugname], function(err, result) {
                //jsonWrite(res, result);
                console.log(result);
                if (err){
                    res.render('fail', {
                        result : result
                    });
                }*//* else {
                    res.render('equipmentlist', {
                        result : result
                    });
                }*//*
                client.end();
                res.redirect("/equipment/installedPlugin/?equipmac=" + equipmac);
            });
        });
    },



    uninstallPlugin : function(req, res, next) {
        var equipmac = req.query.equipmac;
        var plugname = req.query.plugname;
        pg.connect($confconect.consqlString, function(err, client, done) {
            client.query("delete from tblequipmentplugin where equipmac=$1 and plugname=$2", [equipmac, plugname], function(err, result) {
                //jsonWrite(res, result);
                console.log(result);
                if (err){
                    res.render('fail', {
                        result : result
                    });
                }*//* else {
                    res.render('equipmentlist', {
                        result : result
                    });
                }*//*
                client.end();
                res.redirect("/equipment/installedPlugin/?equipmac=" + equipmac);
            });
        });
    },


    equipServiceList : function(req, res, next) {
        var equipmac = req.query.equipmac;
        pg.connect($confconect.consqlString, function(err, client, done) {
            client.query("select * from tblequipmentservice where equipmac=$1", [equipmac], function(err, result) {
                //jsonWrite(res, result);
                console.log(result);
                if (err){
                    res.render('fail', {
                        result : result
                    });
                } else {
                    res.render('equipservicelist', {
                        result : result,
                        equipmac : equipmac
                    });
                }
                client.end();
            });
        });
    },


    setStartAndStatus : function(req, res, next) {
        var autostartData = JSON.parse(req.body.autostartData);
        var sstatusData = JSON.parse(req.body.sstatusData);
        console.log("777777777777777777");
        console.log(autostartData);
        var sql = "";
        var key;
        for(key in autostartData){
            sql += "update tblequipmentservice set autostart=" + autostartData[key] + " where equipmac='11:22:33:44:55:66' and servicename='" + key + "';";
        }
        
        for(key in sstatusData){
            sql += "update tblequipmentservice set servicestatus=" + sstatusData[key] + " where equipmac='11:22:33:44:55:66' and servicename='" + key + "';";
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
                    *//*res.render('equipservicelist', {
                        result : result,
                        equipmac : equipmac
                    });*//*
                }
                client.end();
                //jsonWrite(res, { "a":"b"});
            });
        });
    },

*/
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

    queryAllEquipment : function(req, res, next) {
        var i =0;
            client.query("select * from tblequipment;", function(err, result) {
                //jsonWrite(res, result);
                //console.log(result);
                //evt.emit('wan', {data : result});
                /*if (err){
                    res.render('fail', {
                        result : result
                    });
                } else {
                    res.render('equipmentlist', {
                        result : result
                    });
                }*/
                //client.end();
                while(i < 2000000000){
                    i++;
                }
                    res.render('equipmentlist', {
                        result : result
                    });
            });
        //evt.on('wan', function(data) {
          //  console.log(data);
    },

    queryEquipById : function(req, res, next) {
        var equipmac = req.body.equipmac;
        console.log(equipmac);
            client.query("select * from tblequipment where equipmac=$1", [equipmac], function(err, result) {
                //jsonWrite(res, result);
                console.log(result);
                if (err){
                    res.render('fail', {
                        result : result
                    });
                } else {
                    res.render('queryEquipResult', {
                        result : result
                    });
                }
                //client.end();
            });
    }

};
