var mysql   = require('mysql');
var db = require('db');
var myClient = mysql.createConnection(db.mysql);
 
myClient.connect();




//查询当前直播资源详细页面
function queryById(req, res, next) {
    
    console.log(req.body);

    var resourceId = req.body.resourceId;
    var ret = 0;
    var values = new Array();

    //var selectStr = "select * from dev_live_resource  Left JOIN transfer_resource ON transfer_resource.deviceId=dev_live_resource.deviceId where dev_live_resource.online='1' and transfer_resource.online='1' and resourceId='"+resourceId+"' ";
    var selectStr="select * from dev_live_resource  Left JOIN transfer_resource ON transfer_resource.deviceId=dev_live_resource.deviceId where dev_live_resource.online='1' and transfer_resource.resourceId='"+resourceId+"';";
    console.log(selectStr);

    myClient.query(selectStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }


         result.forEach(function(row) {
                var value = {
                    resourceId : row.resourceId,
                    src : row.src ,
                    deviceId: row.deviceId
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







//查询当前直播资源
function queryAllnow(req, res, next) {
   

    var ret;
    
    var values = new Array();

   // var queryStr = "select * from dev_live_resource  Left JOIN transfer_resource  ON transfer_resource.deviceId=dev_live_resource.deviceId where dev_live_resource.online='1' and transfer_resource.online='1'";
       var queryStr="select * from live_info  Left JOIN dev_live_resource  ON live_info.resourceId=dev_live_resource.resourceId where dev_live_resource.online='1';";
    console.log(queryStr);

    myClient.query(queryStr, function(err, result) {
       
            result.forEach(function(row) {
                var value = {
                    resourceId : row.resourceId,
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


module.exports.queryById = queryById;
module.exports.queryAllnow = queryAllnow;

