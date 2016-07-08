var pg = require('pg');
var $confconect = require('db');
var $sql = require('./pluginSqlMapping');
var multiparty = require('multiparty');
var fs = require('fs');
var db = require('db');
var client = require('db_client');

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
        console.log("12345678");
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
                   + " WHERE vendor_id = '"
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
    
    console.log("Exit addPlugin");

    var insert_str = "INSERT INTO " + db.plugin_table 
                      + " VALUES('" 
                      + req.session.vendorID + "', '"
                      + req.body.plugin_name + "', '"
                      + req.body.plugin_desc  
                      + "');";

    console.log(insert_str);
    
    var db_query = client.query(insert_str);

    db_query.req = req;
    db_query.res = res;

    db_query.on('end', insert_end_handler);
    db_query.on('error', db_error_handler);

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
module.exports.deletePlugin = deletePlugin;

module.exports.queryAllPlugin = queryAllPlugin;
