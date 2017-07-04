//var pg = require('pg');
var $confconect = require('db');
var $sql = require('./pluginSqlMapping');
var multiparty = require('multiparty');
var fs = require('fs');


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



function timeformat1(atime){

       if (!(atime instanceof Date)) {
        return 0;
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




//查询历史直播资源
function queryAllhistory(req, res, next)
{

       var flag = 0;
    console.log("Enter queryAllPlugin");
    //console.log(req.session.vendorID);

    //var vendorID = req.session.vendorID;
    var values = new Array();

    

    //var queryStr = "select * from dev_live_resource  Left JOIN live_info  ON live_info.deviceId=dev_live_resource.deviceId where dev_live_resource.online='0'";
    var queryStr="select distinct live_info.path,live_info.host,live_info.resourceId,dev_live_resource.firstTime,dev_live_resource.lastTime from live_info  Left JOIN dev_live_resource  ON live_info.resourceId=dev_live_resource.resourceId where dev_live_resource.online='0';";
    console.log(queryStr);

    myClient.query(queryStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }

// var queryStr2 = " select count(*) as counts from transfer_resource where  resourceId='"+row.resourceId+"' and online='0' ";
//            // // console.log(queryStr2);
//            //  myClient.query(queryStr2,function(err,result2){



            var resultlength = result.length;
         
        result.forEach(function(row) {

            

            var wathnum = new Array();
            var queryStr2 = " select count(*) as counts from transfer_resource where  resourceId='"+row.resourceId+"' and online='0' ";
           // console.log(queryStr2);
            myClient.query(queryStr2,function(err,result2){

        
           flag++;
         //  console.log("-----------------------------------------------------");
    
         //  console.log(row.firstTime.getFullYear());

           var value = {
                资源序号 : row.resourceId,
                文件名 : row.path ,
                直播平台: row.host,
                开始时间:timeformat1(row.firstTime),
                结束时间:timeformat1(row.lastTime),
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


         
              //res.send(values);


           });

           
        });

      //  console.log("values:::::"+values);

   
   

        


        

     
    });

}






module.exports.queryAllhistory = queryAllhistory;

