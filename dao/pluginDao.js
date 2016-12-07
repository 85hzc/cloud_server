var pg = require('pg');
var $confconect = require('db');
var $sql = require('./pluginSqlMapping');
var multiparty = require('multiparty');
var fs = require('fs');
var db = require('db');
var client = require('db_client');

var pgString = db.consqlString;
var myClient = new pg.Client(pgString);
myClient.connect();

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

function insert_end_handler(result)
{
    console.log("Enter insert_end_handler");

    console.log(result);

    if ( 0 != result.rowCount)
    {
        console.log("insert plugin success");
        this.res.render('register_success');
    }
    console.log("Exit insert_end_handler");
}

//TBD
function db_error_handler(error)
{
    console.log("Enter db_error_handlerx");
    console.log(error);
}

/*
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
    }


 */

function db_row_handler(result)
{
    console.log("Enter db_row_handler");
    this.rows.push(result);
//    console.log(this.rows);
}

function queryAllPluginHandler(result)
{
    console.log(result);

    console.log("111");
    result.rows =this.rows;
    console.log(result.rows);
    this.res.render("queryAllPluginResult", {                                                                                                 
                        result : result
                   }); 
    console.log("222");
}

function queryAllPlugin(req, res, next)
{
    console.log("Enter queryAllPlugin");
    console.log(req.session.vendorID);

    var vendorID = req.session.vendorID;
    var values = new Array();

    var queryStr = "SELECT * from " + db.plugin_table
                   + " WHERE \"vendorId\" = '"
                   + vendorID
                   + "';";

    console.log(queryStr);

    myClient.query(queryStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }

        result.rows.forEach(function(row) {
            var value = {
                pluginId: row.pluginId,
                pluginName: row.pluginName,
                pluginDesc: row.pluginDesc,
                publishVersion: row.publishVersion
            };

            values.push(value);
        });

        var retStr = {
            ret: 0,
            values: values
        };

        res.send(JSON.stringify(retStr));
    });

    /*var db_query = client.query(query_str);
    db_query.req = req;
    db_query.res = res;
    db_query.rows = new Array();

    db_query.on('row', db_row_handler);
    db_query.on('end', queryAllPluginHandler);*/

}

function addPlugin(req, res, next)
{
    console.log("Enter addPlugin");

    console.log(req.session.vendorID);

    console.log(req.body);

    var ret = 0;
    
    var insertStr = "INSERT INTO " + db.plugin_table
                      + "(\"vendorId\",\"pluginName\",\"pluginDesc\")" 
                      + " VALUES('" 
                      + req.session.vendorID + "', '"
                      + req.body.pluginName + "', '"
                      + req.body.pluginDesc
                      + "') RETURNING \"pluginId\";";

    console.log(insertStr);
    
    myClient.query(insertStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }

        var pluginId = result.rows[0].pluginId;
        var fileDir = db.file_server_url + "/" + req.session.vendorName + "/plugin/" + pluginId;

        console.log("pluginDir="+fileDir);

        var updateStr = "UPDATE " + db.plugin_table + " SET \"pluginDir\"='" 
                    + fileDir + "' WHERE \"pluginId\"='" + pluginId + "';";

        console.log(updateStr);

        myClient.query(updateStr, function(err, result) {
            if (err) {
                console.error(err.stack);
                return;
            }

            if (result.rowCount == 1) {
                console.log("update plugin table success.");
            }
            else {
                console.log("update plugin table fails.");
                ret = 1;
            }

            var retStr = {
                    pluginId: pluginId,
                    ret: ret 
                };
            res.send(JSON.stringify(retStr));

        });

    });
    /*var db_query = client.query(insertStr);

    db_query.req = req;
    db_query.res = res;

    db_query.on('end', insert_end_handler);
    db_query.on('error', db_error_handler);*/

}

function addPluginVersion(req, res)
{
    var insertStr = "INSERT INTO plugin_version (\"pluginId\", \"version\", \"changeLog\", \"fileName\", md5) "
            + "VALUES('" + req.body.pluginId + "', '"
            + req.body.version + "', '"
            + req.body.versionDesc + "', '"
            + req.file.originalname + "','"
            + req.body.md5
            + "');";

    console.log(insertStr);

    myClient.query(insertStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }
        if (result.rowCount == 1) {
            console.log("add plugin_version success.");

            var retStr = { ret: 0 };

            res.send(JSON.stringify(retStr));
        }
    });
}

function deletePluginHandler(result)
{
    console.log("Enter deletePluginHandler");
    this.res.redirect('/plugin/allPlugin');
}

function deletePlugin(req, res, next)
{
    console.log("Enter deletePlugin");
    console.log(req.body);
    console.log(req.session.vendorID);
    
    var pluginId = req.body.pluginId;
    var vendorID = req.session.vendorID;

    var queryStr = "DELETE FROM plugin_version" 
                  + " WHERE \"pluginId\"='"
                  + pluginId
                  + "';";

    console.log(queryStr);

    myClient.query(queryStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }

        var deleteStr = "DELETE FROM " + db.plugin_table
                + " WHERE \"pluginId\"='" + pluginId 
                + "' AND \"vendorId\"='" + vendorID
                + "';";

        console.log(deleteStr);

        myClient.query(deleteStr, function(err, result) {
            if (err) {
                console.error(err.stack);
                return;
            }

            var retStr = { ret: 0 };

            res.send(JSON.stringify(retStr));
        });
    });


    /*var db_query = client.query(query_str);
    db_query.res = res;

    db_query.on('end', deletePluginHandler);
    db_query.on('error', db_error_handler);*/

}

function deleteVersion(req, res, next)
{
    console.log("Enter deleteVersion");
    console.log(req.body);
    
    var pluginId = req.body.pluginId;
    var version = req.body.version;

    var queryStr = "DELETE FROM plugin_version" 
                  + " WHERE \"pluginId\"='"
                  + pluginId + "' AND version='"
                  + version
                  + "';";

    console.log(queryStr);

    myClient.query(queryStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }

        var retStr = { ret: 0 };

        res.send(JSON.stringify(retStr));
    });

}

function queryPluginVersion(req, res, next) {
    console.log("Enter query Plugin version");
    console.log(req.body);

    var values = new Array();

    var selectStr = "SELECT * FROM plugin_version WHERE \"pluginId\"='" + req.body.pluginId + "';";

    myClient.query(selectStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }

        result.rows.forEach(function(row) {
            var value = {
                version: row.version,
                changeLog: row.changeLog,
                createTime: row.createTime,
                md5: row.md5
            };

            values.push(value);
        }); 

        var queryStr = "SELECT \"publishVersion\" FROM " + db.plugin_table
                        + " WHERE \"pluginId\"='" + req.body.pluginId + "';";

        console.log(queryStr);

        myClient.query(queryStr, function(err, result1) {
            if (err) {
                console.error(err.stack);
                return;
            }

            var version = result1.rows[0].publishVersion;

            var retStr = {
                ret: 0,
                pluginId: req.body.pluginId,
                publishVersion: version,
                values: values
            };

            res.send(JSON.stringify(retStr));
        });

    });
}

function publishVersion(req, res, next) {
    console.log("Enter publish verison");
    console.log(req.body);

    var pluginId = req.body.pluginId;
    var version = req.body.version;

    var updateStr = "UPDATE " + db.plugin_table
                    + " SET \"publishVersion\"='"
                    + version + "' WHERE \"pluginId\"='"
                    + pluginId
                    + "';";

    console.log(updateStr);

    myClient.query(updateStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }

        var retStr = { ret: 0 };
        res.send(JSON.stringify(retStr));
    });
}


function queryPluginById(req, res, next) {
    console.log("Enter query plugin by id");
    console.log(req.body);

    var pluginId = req.body.pluginId;
    var ret = 0;
    var value;

    var selectStr = "SELECT * FROM " + db.plugin_table
                + " WHERE \"pluginId\"='"
                + pluginId
                + "';";

    console.log(selectStr);

    myClient.query(selectStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }

        if (result.rowCount == 1) {
            value = {
                pluginId: pluginId,
                pluginName: result.rows[0].pluginName,
                pluginDesc: result.rows[0].pluginDesc
            };
        }
        else {
            ret = 1;
        }

        var retStr = {
            ret: ret,
            values: value
        };

        res.send(JSON.stringify(retStr));

    });
}

/*pluginVersion Is exsixt*/
function pluginVersionIsOk(req, res, next) {
    console.log("Enter query Plugin version");
    console.log(req.body);

    var values = new Array();

    var selectStr = "SELECT * FROM plugin_version WHERE \"pluginId\"='" + req.body.pluginId +
        "' and \"version\"='" + req.body.version +"';";

    console.log(selectStr);

    myClient.query(selectStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }
        else {
            res.send(result.rows.length == 0 ? true : false);
        }



    });
}

module.exports.addPlugin = addPlugin;
module.exports.addPluginVersion = addPluginVersion;
module.exports.deletePlugin = deletePlugin;
module.exports.deleteVersion = deleteVersion;
module.exports.publishVersion = publishVersion;

module.exports.queryAllPlugin = queryAllPlugin;
module.exports.queryPluginVersion = queryPluginVersion;
module.exports.queryPluginById = queryPluginById;
module.exports.pluginVersionIsOk = pluginVersionIsOk;
