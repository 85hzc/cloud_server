var pg = require('pg');
var $confconect = require('../conf/db');
var client_intf = require('client_intf');
var EventEmitter = require('events').EventEmitter;
var evt = new EventEmitter();

var pgString = "postgres://wudi:123@localhost/cloud_server_db";

var client = new pg.Client(pgString);
client.connect();

module.exports.addEquipment = addEquipment;
module.exports.deleteEquipment = deleteEquipment;
module.exports.installPlugin = installPlugin;
module.exports.installedPlugin = installedPlugin;
module.exports.installPluginList = installPluginList;
module.exports.uninstallPlugin = uninstallPlugin;
module.exports.equipServiceList = equipServiceList;
module.exports.setStartAndStatus = setStartAndStatus;
module.exports.queryAllEquipment = queryAllEquipment;


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

function queryErrorHandler(error)
{
    console.log("Enter queryErrorHandler");
    console.log(error);
    this.http_res.render('fail', {result : result});
    console.log("Exit queryErrorHandler");
}

function addEquipment (data) 
{
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
}

function deleteEquipment(req, res, next) {
    var sn = req.query.sn;
    var queryString = "delete from tblequipment where sn =" + sn + ";";
    var query = client.query(queryString);

    console.log("Enter deleteEquipment");

    query.on('error', queryErrorHandler);
    query.on('end', function(result){
                        res.redirect("/equipment/allEquipment"); 
                    }
    );
}

function installedPlugin(req, res, next) {
    var sn = req.query.sn;

    var queryString = "select * from tblequipmentplugin where sn = '" + sn + "';";
    console.log(queryString);
    client_intf.server_action_handler(sn, "query_installed", "", 322);
    var query = client.query(queryString);

    query.on('error', queryErrorHandler);
    query.on('row', rowHandler);
    query.on('end', function(result){
	                res.render('equipinstalledplugin', {
                                    result : result,
                                    sn : sn
                        });  
                    }
    );
}

function rowHandler(row, result)
{
    console.log("Enter rowHandler");
    result.addRow(row);
    console.log("Exit rowHandler");
}
function installPluginList(req, res, next) {
    var sn = req.query.sn;


    var queryString = "select * from tblplugin where not exists(select '' from tblequipmentplugin a where a.plugname = tblplugin.plugname and sn='" 
                    + sn
                    + "');";
//    var queryString = "select * from tblplugin where plugname not in(select plugname from tblequipmentplugin where sn='" + sn + "');";
//    var queryString = "select * from tblplugin;";
//    var queryString = "select * from tblplugin where not exists(select '' from tblequipmentplugin a where a.plugname = tblplugin.plugname and sn='tempserialnumber0');";
    console.log(queryString);
    var query = client.query(queryString);

    query.on('row', rowHandler);
    query.on('error', queryErrorHandler);
    query.on('end', function(result){
        console.log(result);
	res.render('equipinstallplugin', {                                                                                                           
		     result : result,                                                                                                     
		     sn : sn                                                                                                              
		 });
	     }
    );
}

function DBPluginHandler(install_insertResult)
{
    console.log("Enter installPluginHandler");
    this.http_res.redirect("/equipment/installedPlugin/?sn=" + this.sn);
    console.log("Exit installPluginHandler");
}

function installPlugin(req, res, next)
{
    var sn = req.query.sn;
    var plugname = req.query.plugname;

    var return_serverActionHandler = client_intf.server_action_handler(sn, "install", plugname, 321);

    /* TBD error handler of server_action_handler */
    console.log("Enter installPlugin");
    console.log(return_serverActionHandler);

    if ( 3 != return_serverActionHandler)
    {
        console.log("command sent failed");
        res.render('fail', {result : result});
    }

    var queryString = "insert into tblequipmentplugin values('" + sn + "','" + plugname + "','" + return_serverActionHandler + "');"

    console.log(queryString);

    var insertQuery = client.query(queryString);

    insertQuery.http_res = res;
    insertQuery.sn = sn
    insertQuery.on('row', rowHandler);
    insertQuery.on('error', queryErrorHandler);
    insertQuery.on('end', DBPluginHandler); 
}

function uninstallPlugin(req, res, next)
{
    var sn = req.query.sn;
    var plugname = req.query.plugname;

    var return_serverActionHandler = client_intf.server_action_handler(sn, "uninstall", plugname, 321);

    /* TBD error handler of server_action_handler */

    if ( 3 != return_serverActionHandler)
    {
        console.log("command sent failed");
        res.render('fail', {result : result});
    }

    var queryString = "delete from tblequipmentplugin where sn='" + sn + "'and plugname = '" + plugname + "';"

    console.log(queryString);

    var deleteQuery = client.query(queryString);

    deleteQuery.http_res = res;
    deleteQuery.sn = sn

    deleteQuery.on('error', queryErrorHandler);
    deleteQuery.on('end', DBPluginHandler);
}


function equipServiceList(req, res, next)
{
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
}


function setStartAndStatus(req, res, next)
{
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
}

function queryAllEquipment(req, res, next)
{
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
}


function queryEquipById(req, res, next)
{
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
