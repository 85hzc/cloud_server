


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


function send_stat(res, values) {
    var retStr = {
        values: values
    };
    res.send(retStr);
}

function addDataModel(req, res, next) {
    console.log("Enter add data model.");
    console.log(req.body);

    var ret = 1;
    var vendorID = req.session.vendorID;

    var insertStr = "INSERT INTO iot_dev_datamodel(manufacture,manufactureDataModelId,devDesc,name,vendorId)"
    + " VALUES('"+req.body.manufacture +" ','"+ req.body.manufactureDataModelId + "', '"+ req.body.devDesc + "', '"+ req.body.name + "', '"+ vendorID+ "') ";

    myClient.query(insertStr);
    console.log(insertStr);

    var selectStr='SELECT @@IDENTITY AS ID';

    console.log(selectStr);
    myClient.query(selectStr, function(err, result) {
        if (err) {
            console.error(err.stack);
        }
        else {
            var dataModelId = result[0].ID;
            
            ret = 0;
        }

        var retStr = {
            dataModelId: dataModelId,
            ret: ret
        };

        res.send(JSON.stringify(retStr));
    });
}

/*修改dataModel设备类型*/
function changeDataModel(req, res, next) {
    console.log("Enter change data model.");
    console.log(req.body);

    var ret = 1;
    var vendorID = req.session.vendorID;
   

    var insertStr = "UPDATE iot_dev_datamodel SET "
                +"manufacture = '"
                +req.body.manufacture+"',"
 		+"name = '"
                +req.body.name+"',"
                +"manufactureDataModelId = '"
                +req.body.manufactureDataModelId+"',"
                +" devDesc = '"
                +req.body.devDesc+"'" 
                +" WHERE dataModelId = "+req.body.dataModelId+";";


    console.log(insertStr);

    myClient.query(insertStr, function(err, result) {
        if (err) {
            console.error("错误代码如下");
            console.error(err.stack);
        }
        else {
            ret = 0;
        }
        var retStr = {
            ret: ret
        };
        res.send(JSON.stringify(retStr));
    });
}

/*修改dataModel设备类型*/

function updateDataModel(req, res) {
    console.log("Enter datamodel handler");
    console.log(req.body);

    var ret = 1;

    var jsonFile = db.file_save_dir + '/' + req.session.vendorName
                + '/datamodel/' + req.body.dataModelId
                + '/' + req.file.originalname;

    console.log("json locals:" +  jsonFile);

    fs.readFile(jsonFile, function(err, data) {
        if (err) {
            console.error(err.stack);
            return;
        }

        var obj = JSON.parse(data);

        var updateStr = "UPDATE iot_dev_datamodel SET devDataModel='"
                    + JSON.stringify(obj) + "' WHERE dataModelId='"
                    + req.body.dataModelId + "';"; 
        
        console.log(updateStr);

        myClient.query(updateStr, function(err, result) {
            if (err) {
                console.error(err.stack);
            }
            else if (result.rowCount == 1) {
                ret = 0;
            }

            var retStr = {
                    ret: ret
                };

            res.send(JSON.stringify(retStr));

        });
    });
}

function deleteDataModel(req, res, next) {
    console.log("Enter delete datamodel");
    console.log(req.body);

    var ret = 1;

    var queryStr = "DELETE FROM iot_device WHERE deviceDataModelId='"
                    + req.body.dataModelId
                    + "';";

    console.log(queryStr);

    myClient.query(queryStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }
        
        var deleteStr = "DELETE FROM iot_dev_datamodel"
                    + " WHERE dataModelId='"
                    + req.body.dataModelId 
                    + "' AND vendorId='"
                    + req.session.vendorID
                    + "';";

        console.log(deleteStr);

        myClient.query(deleteStr, function(err, result) {
            if (err) {
                console.error(err.stack);
            }
            else {
                ret = 0;
            }

            var retStr = {ret: ret};
            res.send(JSON.stringify(retStr));
        });

    });

}

function stat(req, res, next) {
    console.log("Enter device statistics.");

    var values = new Array();
    var stat = 8;

    /* 路由器总台数*/
    var vendorStr = "SELECT count(*) as count FROM iot_device";
    console.log(vendorStr);

    myClient.query(vendorStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }
        
        var value = {
            name: "路由器总台数",
            count: result[0].count
        };

        console.log(value);

        values.push(value);
        stat--;

        if (stat == 0) send_stat(res, values);
    });

    /*在线台数*/
    var devStr = "SELECT COUNT(*) as count FROM iot_device WHERE online='1';";
    console.log(devStr);

    myClient.query(devStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }

        var value = {
            name: "在线台数",
            count: result[0].count
        };

        console.log(value);

        values.push(value);
        stat--;

        if (stat == 0) send_stat(res, values);
    });

    /*正在观看的直播资源数*/
    var devOnlineStr = "SELECT count(*) as count FROM dev_live_resource WHERE online=1;";
    console.log(devOnlineStr);

    myClient.query(devOnlineStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }

        var value = {
            name: "正在观看的直播节目数",
            count: result[0].count
        };

        console.log(value);

        values.push(value);
        stat--;

        if (stat == 0) send_stat(res, values);
    });

    /*从直播网站获取的流*/
    var pluginStr = "SELECT count(*) as count FROM transfer_resource WHERE src='origin' AND online='1' ;";
    console.log(pluginStr);

    myClient.query(pluginStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }

        var value = {
            name: "从直播网站获取的流",
            count: result[0].count
        };

        console.log(value);

        values.push(value);
        stat--;

        if (stat == 0) send_stat(res, values);
    });

    /*P2P转发的总数*/
    var appStr = "select count(*) as count from transfer_resource where src!='origin' AND online='1';";
    console.log(appStr);

    myClient.query(appStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }

        var value = {
            name: "P2P转发的总数",
            count: result[0].count
        };

        console.log(value);

        values.push(value);
        stat--;

        if (stat == 0) send_stat(res, values);
    });



    /*datamodel counts*/
   var datamodelStr = "SELECT sum(totalBytes) as count FROM transfer_resource";
    console.log(datamodelStr);

    myClient.query(datamodelStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }

        var value = {
            name: "直播流的总字节数",
            count: result[0].count
        };

        console.log(value);

        values.push(value);
        stat--;

        if (stat == 0) send_stat(res, values);
    });

    /*datamodel counts*/
   var datamodelStr = "SELECT sum(totalBytes) as count FROM transfer_resource WHERE src='origin'";
    console.log(datamodelStr);

    myClient.query(datamodelStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }

        var value = {
            name: "从直播平台获取流的总字节数",
            count: result[0].count
        };

        console.log(value);

        values.push(value);
        stat--;

        if (stat == 0) send_stat(res, values);
    });


    var datamodelStr = "SELECT sum(totalBytes) as count FROM transfer_resource WHERE src!='origin'";
    console.log(datamodelStr);

    myClient.query(datamodelStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }

        var value = {
            name: "P2P转发流的总字节数",
            count: result[0].count
        };

        console.log(value);

        values.push(value);
        stat--;

        if (stat == 0) send_stat(res, values);
    });

}

function queryAllDev(req, res, next) {
    console.log("Enter query all dev");
    console.log(req.session.vendorID);

    var vendorID = req.session.vendorID;
    var values = new Array();

    var queryStr = 'SELECT * FROM iot_dev_datamodel WHERE vendorId= "'+vendorID+'" ';

    console.log(queryStr);

    myClient.query(queryStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }

        var jsonIsExist;
        console.log(result);
        result.forEach(function(row) {
            if (row.devDataModel != null) {
                jsonIsExist = 1;
            }
            else {
                jsonIsExist = 0;
            }

            var value = {
                dataModelId: row.dataModelId,
                manufacture: row.manufacture,
                manufactureDataModelId: row.manufactureDataModelId,
                devDesc: row.devDesc,
                jsonIsExist: jsonIsExist,
                pluginId: row.pluginId,
                firmwareId: row.firmwareId,
                name: row.name
            };

            values.push(value);
        });

        var retStr = {
            ret: 0,
            values: values
        };

        res.send(JSON.stringify(retStr));
    });
}

function addPlugin(req, res, next) {
    console.log("Enter dev add plugin");
    console.log(req.body);

    var pluginId = req.body.pluginId;
    var dataModelId = req.body.dataModelId;

    var updateStr = "UPDATE iot_dev_datamodel SET pluginId='"
                + pluginId + "' WHERE dataModelId='"
                + dataModelId
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



module.exports.addDataModel = addDataModel;
module.exports.updateDataModel = updateDataModel;
module.exports.deleteDataModel = deleteDataModel;
module.exports.stat = stat;
module.exports.queryAllDev = queryAllDev;
module.exports.addPlugin = addPlugin;
module.exports.changeDataModel = changeDataModel;
