var pg = require('pg');
var db = require('db');
var fs = require('fs');
var pgString = db.consqlString;
var myClient = new pg.Client(pgString);

myClient.connect();

function send_stat(res, values) {
    var retStr = {
        values: values
    };
    res.send(JSON.stringify(retStr));
}

function addDataModel(req, res, next) {
    console.log("Enter add data model.");
    console.log(req.body);

    var ret = 1;

    var insertStr = "INSERT INTO iot_dev_datamodel(\"manufacture\",\"manufactureDataModelId\")"
                + " VALUES('"
                + req.body.manufacture + "', '"
                + req.body.manufactureDataModelId
                + "') RETURNING \"dataModelId\";";

    console.log(insertStr);

    myClient.query(insertStr, function(err, result) {
        if (err) {
            console.error(err.stack);
        }
        else {
            var dataModelId = result.rows[0].dataModelId;
            ret = 0;
        }

        var retStr = {
            dataModelId: dataModelId,
            ret: ret
        };

        res.send(JSON.stringify(retStr));
    });
}

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

        var updateStr = "UPDATE iot_dev_datamodel SET \"devDataModel\"='"
                    + JSON.stringify(obj) + "' WHERE \"dataModelId\"='"
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

    var deleteStr = "DELETE FROM iot_dev_datamodel"
                    + " WHERE \"dataModelId\"='"
                    + req.body.dataModelId 
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
    
}

function stat(req, res, next) {
    console.log("Enter device statistics.");

    var values = new Array();
    var stat = 3;

    /*developer counts*/
    var vendorStr = "SELECT count(*) FROM " +  db.vendor_table + ";";
    console.log(vendorStr);

    myClient.query(vendorStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }

        var value = {
            name: "开发者人数",
            count: result.rows[0].count
        };

        console.log(value);

        values.push(value);
        stat--;

        if (stat == 0) send_stat(res, values);
    });

    /*device counts*/
    var devStr = "SELECT count(*) FROM iot_device;";
    console.log(devStr);

    myClient.query(devStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }

        var value = {
            name: "设备数量",
            count: result.rows[0].count
        };

        console.log(value);

        values.push(value);
        stat--;

        if (stat == 0) send_stat(res, values);
    });

    /*online device counts*/
    var devOnlineStr = "SELECT count(*) FROM iot_device WHERE online=true;";
    console.log(devOnlineStr);

    myClient.query(devOnlineStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }

        var value = {
            name: "在线设备数量",
            count: result.rows[0].count
        };

        console.log(value);

        values.push(value);
        stat--;

        if (stat == 0) send_stat(res, values);
    });
}

module.exports.addDataModel = addDataModel;
module.exports.updateDataModel = updateDataModel;
module.exports.deleteDataModel = deleteDataModel;
module.exports.stat = stat;
