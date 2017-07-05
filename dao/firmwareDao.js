/*
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
connect();*/


var mysql   = require('mysql');
var db = require('db');

var myClient;
function handleDisconnect() {
myClient = mysql.createConnection(db.mysql); // Recreate the connection, since
// the old one cannot be reused.
myClient.connect(function(err) {              // The server is either down
if(err) {                                     // or restarting (takes a while sometimes).
console.log('error when connecting to db:', err);
setTimeout(handleDisconnect, 1000); // We introduce a delay before attempting to reconnect,
}                                     // to avoid a hot loop, and to allow our node script to
});                                     // process asynchronous requests in the meantime.
// If you're also serving http, display a 503 error.
myClient.on('error', function(err) {
console.log('db error', err);
if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
handleDisconnect();                         // lost due to either server restart, or a
} else {                                      // connnection idle timeout (the wait_timeout
throw err;                                  // server variable configures this)
}
});
}
handleDisconnect();


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

            var name = row.beMaster == 1 ? "可用" : "不可用";
            var uname = row.online == 1 ? "在线" : "不在线";
            var value = {
                deviceId  : row.deviceId ,
                序列号  : row.manufactureSN  ,
                是否可提供服务 : name,
                IP地址 :row.ipAddr ,
                是否在线: uname
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
        var queryStr="select distinct resourceId,deviceId,src  from transfer_resource where (deviceId='"+deviceId+"' or src='"+deviceId+"') and online!='0'";
    //select distinct resourceId,deviceId,src,online from transfer_resource where  (deviceId='1' or src='1') and online!='1' ;
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
//timeformat
function timeformat1(atime){

        if (!(atime instanceof Date)) {
        return "N/A";
    }
     var y = atime.getFullYear();
     var m = atime.getMonth() + 1;
     m = m < 10 ? ('0'+m) : m;
     var d = atime.getDate();
     d = d < 10 ? ("0" + d) : d;
     var h = atime.getHours();
     var minute = atime.getMinutes();
     minute = minute < 10 ? ("0"+minute) : minute;
    var second= atime.getSeconds();
     second = second < 10 ? ("0"+second) : second;


     return y + '-' + m + '-' + d + ' '+h+':'+minute+':'+ second;
}

//路由器历史资源信息
function queryhismsg(req, res, next) {
    var values = new Array();

    var deviceId = req.body.deviceId;

    //var vendorID = req.session.vendorID;

    //var queryStr = "select  distinct transfer_resource.resourceId,transfer_resource.deviceId,transfer_resource.src from dev_live_resource  Left JOIN transfer_resource  ON transfer_resource.deviceId=dev_live_resource.deviceId where dev_live_resource.online='0'  and dev_live_resource.deviceId='"+deviceId+"' ; ";
    //var queryStr="select distinct resourceId,deviceId,src  from transfer_resource where deviceId='"+deviceId+"' and online!='1'";
    // var queryStr="select distinct resourceId,deviceId,src  from transfer_resource where (deviceId='"+deviceId+"' or src='"+deviceId+"') and online!='1'";
    //var queryStr=" select  distinct transfer_resource.totalBytes, transfer_resource.resourceId,transfer_resource.deviceId,transfer_resource.src ,dev_live_resource.firstTime,dev_live_resource.lastTime from transfer_resource left join dev_live_resource on transfer_resource.deviceId= dev_live_resource.deviceId where (transfer_resource.deviceId='"+deviceId+"' or transfer_resource.src='"+deviceId+"') and transfer_resource.online!='1';";
    var queryStr="select distinct resourceId,src,deviceId,startTime,endTime,totalBytes from transfer_resource where (deviceId='"+deviceId+"' or src='"+deviceId+"') and online!='1';";
    console.log(queryStr);

    myClient.query(queryStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }

        result.forEach(function(row) {

            
            var value = {
                resourceId: row.resourceId,
                src: row.src ,
                deviceId:row.deviceId,
                firstTime:timeformat1(row.startTime),
                lastTime:timeformat1(row.endTime),
                totalBytes:row.totalBytes
            };

            values.push(value);
        });

        var results = {
            ret:0,
            values:values
        };
        console.log(results);
        res.send(results);
            
    });


}





function queryresourcebyday(req, res, next) {
    var values = new Array();

   // var deviceId = req.body.deviceId;

    //var vendorID = req.session.vendorID;

    //var queryStr = "select  distinct transfer_resource.resourceId,transfer_resource.deviceId,transfer_resource.src from dev_live_resource  Left JOIN transfer_resource  ON transfer_resource.deviceId=dev_live_resource.deviceId where dev_live_resource.online='0'  and dev_live_resource.deviceId='"+deviceId+"' ; ";
    //var queryStr="select distinct resourceId,deviceId,src  from transfer_resource where deviceId='"+deviceId+"' and online!='1'";
    // var queryStr="select distinct resourceId,deviceId,src  from transfer_resource where (deviceId='"+deviceId+"' or src='"+deviceId+"') and online!='1'";
    //var queryStr=" select  distinct transfer_resource.totalBytes, transfer_resource.resourceId,transfer_resource.deviceId,transfer_resource.src ,dev_live_resource.firstTime,dev_live_resource.lastTime from transfer_resource left join dev_live_resource on transfer_resource.deviceId= dev_live_resource.deviceId where (transfer_resource.deviceId='"+deviceId+"' or transfer_resource.src='"+deviceId+"') and transfer_resource.online!='1';";
    var queryStr=" SELECT  count(*) as res , sum(totalBytes) as totalBytes, DATE_FORMAT(doc.firstTime, '%Y-%m-%d') AS time  FROM  dev_live_resource doc ,transfer_resource tran WHERE doc.resourceId=tran.resourceId and DATE_FORMAT(doc.lastTime, '%Y') = '2017'  GROUP BY  time  ORDER BY NULL";
    console.log(queryStr);

    myClient.query(queryStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }

        result.forEach(function(row) {

            
            var value = {
                resourceCount: row.res,
                totalBytes: row.totalBytes ,
                time:row.time
            };

            values.push(value);
        });

        var results = {
            ret:0,
            values:values
        };
        console.log(results);
        res.send(results);
            
    });


}




// each month
function totalBytesBytime(req, res, next) {
    var values = new Array();

  
    //var queryStr=" SELECT  count(*) as res , sum(totalBytes) as totalBytes, DATE_FORMAT(doc.firstTime, '%Y-%m-%d') AS time  FROM  dev_live_resource doc ,transfer_resource tran WHERE doc.resourceId=tran.resourceId and DATE_FORMAT(doc.lastTime, '%Y') = '2017'  GROUP BY  time  ORDER BY NULL";
    //var queryStr="select sum(deviceId) as totalBytes from  dev_live_resource where date_format(firstTime,'%Y-%m')=date_format(now(),'%Y-%m')  ;";
    var queryStr="select sum(totalBytes) as totalBytes,startTime from transfer_resource group by date_format(startTime, '%Y-%m');";
    console.log(queryStr);

    myClient.query(queryStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }


         result.forEach(function(row) {
            
            var value = {
               totalBytes:row.totalBytes,
                time:timeformat1(row.startTime)
            };

            values.push(value);
        });


        var results = {
            ret:0,
            values:values
        };
        console.log(results);
        res.send(results);
            
    });


}



//each month by deviceid
function totalBytesBydeviceId(req, res, next) {
    var values = new Array();

    var deviceId = req.body.deviceId;

  
    //var queryStr=" SELECT  count(*) as res , sum(totalBytes) as totalBytes, DATE_FORMAT(doc.firstTime, '%Y-%m-%d') AS time  FROM  dev_live_resource doc ,transfer_resource tran WHERE doc.resourceId=tran.resourceId and DATE_FORMAT(doc.lastTime, '%Y') = '2017'  GROUP BY  time  ORDER BY NULL";
    //var queryStr="select sum(deviceId) as totalBytes from  dev_live_resource where date_format(firstTime,'%Y-%m')=date_format(now(),'%Y-%m')  ;";
    //var queryStr="select sum(totalBytes) as totalBytes,startTime from transfer_resource group by date_format(startTime, '%Y-%m');";

    var queryStr="select sum(totalBytes) as totalBytes,startTime from transfer_resource where src='"+deviceId+"' or deviceId='"+deviceId+"' group by date_format(startTime, '%Y-%m');";
    console.log(queryStr);

    myClient.query(queryStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }


         result.forEach(function(row) {
            
            var value = {
               totalBytes:row.totalBytes,
                time:timeformat1(row.startTime)
            };

            values.push(value);
        });


        var results = {
            ret:0,
            values:values
        };
        console.log(results);
        res.send(results);
            
    });


}




//each week
function totalsumByweek(req, res, next) {
    var values = new Array();

    var deviceId = req.body.deviceId;

  
   
    var queryStr="select count(*) as num,  startTime, week(startTime) as week from transfer_resource group by week(startTime)";
    console.log(queryStr);

    myClient.query(queryStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }


         result.forEach(function(row) {
            
            var value = {
                num:row.num,
                startTime:timeformat1(row.startTime),
                week:row.week
            };

            values.push(value);
        });


        var results = {
            ret:0,
            values:values
        };
        console.log(results);
        res.send(results);
            
    });


}



//
function countLiveByweek(req, res, next) {

 var flag = 0;

    var values = new Array();

    //var deviceId = req.body.deviceId;

    //var queryStr="select count(*) as num,  startTime, week(startTime) as week from transfer_resource group by week(startTime)";
    var queryStr="select  startTime, count(resourceId) as counts, resourceId,week(startTime) as week from transfer_resource   group by week(startTime),resourceId  order by week ,counts desc  ;";
    console.log(queryStr);

    myClient.query(queryStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }

         var resultlength = result.length;
         result.forEach(function(row) {

            var wathnum = new Array();

            var queryStr2="select * from live_info where resourceId='"+row.resourceId+"' ";
            console.log(queryStr2);
            myClient.query(queryStr2,function(err,results){

                flag++;

                var value = {
                    countst:row.counts,
                    resourceId:row.resourceId,
                    week:row.week,
                    startTime:timeformat1(row.startTime),
                    host:results[0].host,
                    path:results[0].path


                };

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

            
    });


}



//
function countOffLine(req, res, next) {

 var flag = 0;

    var values = new Array();

    //var deviceId = req.body.deviceId;

    //var queryStr="select count(*) as num,  startTime, week(startTime) as week from transfer_resource group by week(startTime)";
   // var queryStr="select  startTime, count(resourceId) as counts, resourceId,week(startTime) as week from transfer_resource   group by week(startTime),resourceId  order by week ,counts desc  ;";
    var queryStr="select  startTime, count(resourceId) as counts ,resourceId from transfer_resource where online='0'   group by resourceId  order by  counts desc limit 0,10 ;";
    console.log(queryStr);

    myClient.query(queryStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }

         var resultlength = result.length;
         result.forEach(function(row) {

            var wathnum = new Array();

            var queryStr2="select * from live_info where resourceId='"+row.resourceId+"' ";
            console.log(queryStr2);
            myClient.query(queryStr2,function(err,results){

                flag++;

                var value = {
                    countst:row.counts,
                    resourceId:row.resourceId,
                    startTime:timeformat1(row.startTime),
                    host:results[0].host,
                    path:results[0].path


                };

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

            
    });


}



function countOnLine(req, res, next) {

 var flag = 0;

    var values = new Array();

    //var deviceId = req.body.deviceId;

    //var queryStr="select count(*) as num,  startTime, week(startTime) as week from transfer_resource group by week(startTime)";
   // var queryStr="select  startTime, count(resourceId) as counts, resourceId,week(startTime) as week from transfer_resource   group by week(startTime),resourceId  order by week ,counts desc  ;";
    var queryStr="select  startTime, count(resourceId) as counts ,resourceId from transfer_resource where online='1'   group by resourceId  order by  counts desc limit 0,10 ;";
    console.log(queryStr);

    myClient.query(queryStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }

         var resultlength = result.length;
         result.forEach(function(row) {

            var wathnum = new Array();

            var queryStr2="select * from live_info where resourceId='"+row.resourceId+"' ";
            console.log(queryStr2);
            myClient.query(queryStr2,function(err,results){

                flag++;

                var value = {
                    countst:row.counts,
                    resourceId:row.resourceId,
                    startTime:timeformat1(row.startTime),
                    host:results[0].host,
                    path:results[0].path


                };

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

            
    });


}






module.exports.queryAllroute = queryAllroute;
module.exports.querynowmsg = querynowmsg;
module.exports.queryhismsg = queryhismsg;
module.exports.queryresourcebyday = queryresourcebyday;
module.exports.totalBytesBytime = totalBytesBytime;
module.exports.totalBytesBydeviceId = totalBytesBydeviceId;
module.exports.totalsumByweek = totalsumByweek;
module.exports.countLiveByweek = countLiveByweek;

module.exports.countOffLine = countOffLine;
module.exports.countOnLine = countOnLine;


