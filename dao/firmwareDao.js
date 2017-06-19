
var mysql   = require('mysql');
var db = require('db');
var myClient = mysql.createConnection(db.mysql);
 
myClient.connect();



//查询所有路由器
function queryAllroute(req, res, next) {
    var values = new Array();
    // console.log("Enter queryAllFirmware");
    // console.log("vendorID=" + req.session.vendorID + ",vendorName=" + req.session.vendorName);

    //var vendorID = req.session.vendorID;

    var queryStr = "SELECT * FROM iot_device ";

    console.log(queryStr);

    myClient.query(queryStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }


        result.forEach(function(row) {
            var value = {
                deviceId  : row.deviceId ,
                唯一序列号  : row.manufactureSN  ,
                是否可用 : row.beMaster ,
                IP地址 :row.ipAddr ,
                是否在线: row.online
            };

            values.push(value);
        });

        var results = {
            ret:0,
            values:values
        };

        res.send(results);
       
    });


}


//路由器当前资源信息
function querynowmsg(req, res, next) {
    var values = new Array();

    var deviceId = req.body.deviceId;
   

    //var vendorID = req.session.vendorID;

    //var queryStr = "select  from dev_live_resource  Left JOIN transfer_resource  ON transfer_resource.deviceId=dev_live_resource.deviceId where dev_live_resource.online='1'  and dev_live_resource.deviceId='"+deviceId+"'  ; ";
        var queryStr="select distinct resourceId,deviceId,src  from transfer_resource where deviceId='"+deviceId+"' or src='"+deviceId+"' and online!='0'";
    console.log(queryStr);

    myClient.query(queryStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }


        result.forEach(function(row) {
            var value = {

                 resourceId: row.resourceId,
                deviceId:row.deviceId,
                src: row.src ,
            };

            values.push(value);
        });

        var results = {
            ret:0,
            values:values
        };

        res.send(results);
        // res.render("queryAllFirmwareResult",
        //             {result: result});
    });

}


//路由器历史资源信息
function queryhismsg(req, res, next) {
    var values = new Array();

    var deviceId = req.body.deviceId;

    //var vendorID = req.session.vendorID;

    //var queryStr = "select  distinct transfer_resource.resourceId,transfer_resource.deviceId,transfer_resource.src from dev_live_resource  Left JOIN transfer_resource  ON transfer_resource.deviceId=dev_live_resource.deviceId where dev_live_resource.online='0'  and dev_live_resource.deviceId='"+deviceId+"' ; ";
    //var queryStr="select distinct resourceId,deviceId,src  from transfer_resource where deviceId='"+deviceId+"' and online!='1'";
     var queryStr="select distinct resourceId,deviceId,src  from transfer_resource where deviceId='"+deviceId+"' or src='"+deviceId+"' and online!='1'";
    console.log(queryStr);

    myClient.query(queryStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }

        result.forEach(function(row) {
            var value = {
                resourceId: row.resourceId,
                deviceId:row.deviceId,
                src: row.src ,
            };

            values.push(value);
        });

        var results = {
            ret:0,
            values:values
        };

        res.send(results);
            
    });


}


module.exports.queryAllroute = queryAllroute;
module.exports.querynowmsg = querynowmsg;
module.exports.queryhismsg = queryhismsg;

