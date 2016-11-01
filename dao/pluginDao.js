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
    var query_str = "SELECT * from " + db.plugin_table
                   + " WHERE \"vendorId\" = '"
                   + vendorID
                   + "';";

    console.log(query_str);
    var db_query = client.query(query_str);
    db_query.req = req;
    db_query.res = res;
    db_query.rows = new Array();

    db_query.on('row', db_row_handler);
    db_query.on('end', queryAllPluginHandler);

}

function addPlugin(req, res, next)
{
    console.log("Enter addPlugin");

    console.log(req.session.vendorID);

    console.log(req.body);

    var ret = 0;
    
    var insertStr = "INSERT INTO " + db.plugin_table
                      + "(\"vendorId\",\"pluginName\",\"pluginDesc\",\"newestVersion\")" 
                      + " VALUES('" 
                      + req.session.vendorID + "', '"
                      + req.body.plugin_name + "', '"
                      + req.body.plugin_desc + "', '"
                      + req.body.newestVersion  
                      + "');";

    console.log(insertStr);
    
    myClient.query(insertStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }

        var pluginId = result.rows[0].pluginId;
        var fileDir = db.file_server_url + "/" + req.session.vendorName + "/plugin/" + pluginId;

        console.log("pluginDir="+fileDir);

        var updateStr = "UPDATE " + db.plugin_table + "SET \"pluginDir\"='" 
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
    /*var db_query = client.query(insert_str);

    db_query.req = req;
    db_query.res = res;

    db_query.on('end', insert_end_handler);
    db_query.on('error', db_error_handler);*/

}

function addPluginVersion(req, res)
{
    var insertStr = "INSERT INTO plugin_version (\"pluginId\", \"version\", \"changeLog\", \"fileName\") "
            + "VALUES('" + req.body.pluginId + "', '"
            + req.body.version + "', '"
            + req.body.versionDesc + "', '"
            + req.file.originalname
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
    
    var plugin_name = req.query.plugin_name;
    var vendorID = req.session.vendorID;

    console.log(plugin_name);

    var query_str = "DELETE FROM " + db.plugin_table 
                  + " WHERE vendor_id = '"
                  + vendorID
                  + "' and plugin_name = '"
                  + plugin_name
                  + "';"

    console.log(query_str);

    var db_query = client.query(query_str);
    db_query.res = res;

    db_query.on('end', deletePluginHandler);
    db_query.on('error', db_error_handler);

}

module.exports.addPlugin = addPlugin;
module.exports.addPluginVersion = addPluginVersion;
module.exports.deletePlugin = deletePlugin;

module.exports.queryAllPlugin = queryAllPlugin;
