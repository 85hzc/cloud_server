/*var mysql   = require('mysql');
var db = require('db');
var myClient = mysql.createConnection(db.mysql);
 
myClient.connect();*/

var mysql   = require('mysql');
var db = require('db');
// var myClient = mysql.createConnection(db.mysql);
 
// myClient.connect();



function handleError (err) {  
    if (err) {
        // 如果是连接断开，自动重新连接
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            connect();
    } else {
        console.error(err.stack || err);
    }
    }
}

// 连接数据库  
function connect () {
    myClient = mysql.createConnection(db.mysql);
    myClient.connect(handleError);
    myClient.on('error', handleError);
}
      
var myClient;
connect();




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
     var flag = 0;
    
    var values = new Array();

   // var queryStr = "select * from dev_live_resource  Left JOIN transfer_resource  ON transfer_resource.deviceId=dev_live_resource.deviceId where dev_live_resource.online='1' and transfer_resource.online='1'";
       var queryStr="select distinct live_info.path,live_info.host,live_info.resourceId from live_info  Left JOIN dev_live_resource  ON live_info.resourceId=dev_live_resource.resourceId where dev_live_resource.online='1';";
    console.log(queryStr);

    myClient.query(queryStr, function(err, result) {

                  var resultlength = result.length;
                  console.log(resultlength);
       if (resultlength != 0) {
        result.forEach(function(row) {

            var wathnum = new Array();
           
            var queryStr2 = " select count(*) as counts from transfer_resource where  resourceId='"+row.resourceId+"' and online='1' ";
           // console.log(queryStr2);
            myClient.query(queryStr2,function(err,result2){

           flag++;
           var value = {
                resourceId : row.resourceId,
                文件名 : row.path ,
                直播平台: row.host,
                观众数:result2[0].counts
               // 观众数:rows.counts
            };
           
            //console.log(value);
             values.push(value);
         
             if (flag == resultlength) {
                
            var retStr = {
                ret: 0,
                values: values
            };
            flag = 0;
            console.log(retStr);
            res.send(retStr);
   


             }
              
           });


           
        });

        
}else{

              var retStr = {
                ret: 0,
                values: []
            };
            console.log(retStr);
            res.send(retStr);

}





    });
}


module.exports.queryById = queryById;
module.exports.queryAllnow = queryAllnow;

