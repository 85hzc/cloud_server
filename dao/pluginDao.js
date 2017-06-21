//var pg = require('pg');
var $confconect = require('db');
var $sql = require('./pluginSqlMapping');
var multiparty = require('multiparty');
var fs = require('fs');


var mysql   = require('mysql');
var db = require('db');
var myClient = mysql.createConnection(db.mysql);
 
myClient.connect();




//查询历史直播资源
function queryAllhistory(req, res, next)
{
    console.log("Enter queryAllPlugin");
    //console.log(req.session.vendorID);

    //var vendorID = req.session.vendorID;
    var values = new Array();

    //var queryStr = "select * from dev_live_resource  Left JOIN live_info  ON live_info.deviceId=dev_live_resource.deviceId where dev_live_resource.online='0'";
    var queryStr="select distinct live_info.path,live_info.host,live_info.resourceId from live_info  Left JOIN dev_live_resource  ON live_info.resourceId=dev_live_resource.resourceId where dev_live_resource.online='0';";
    console.log(queryStr);

    myClient.query(queryStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }

        result.forEach(function(row) {
            var value = {
                资源序号 : row.resourceId,
                文件名 : row.path ,
                直播平台: row.host
            };

            values.push(value);
        });

        var retStr = {
            ret: 0,
            values: values
        };

        res.send(retStr);
    });

}






module.exports.queryAllhistory = queryAllhistory;

