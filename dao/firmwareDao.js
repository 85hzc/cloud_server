var pg = require('pg');
var db = require('db');

var pgString = db.consqlString;
var myClient = new pg.Client(pgString);

myClient.connect();


function queryAllFirmware(req, res, next) {
    console.log("Enter queryAllFirmware");
    console.log("vendorID=" + req.session.vendorID + ",vendorName=" + req.session.vendorName);

    var vendorID = req.session.vendorID;

    var queryStr = "SELECT * FROM firmware_table WHERE \"vendorId\"='"
                + vendorID
                + "';";

    console.log(queryStr);

    myClient.query(queryStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }

        res.render("queryAllFirmwareResult",
                    {result: result});
    });
}

function addFirmware(req, res, next)
{
    console.log("Enter addFirmware");
    console.log("vendorID=" + req.session.vendorID + ",vendorName=" + req.session.vendorName);
    console.log(req.body);

    var ret = 0;
    
    var insertStr = "INSERT INTO firmware_table"
                      + "(\"vendorId\",\"firmwareName\",\"firmwareDesc\")" 
                      + " VALUES('" 
                      + req.session.vendorID + "', '"
                      + req.body.firmwareName + "', '"
                      + req.body.firmwareDes
                      + "') RETURNING \"firmwareId\";";

    console.log(insertStr);
    
    myClient.query(insertStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }

        var firmwareId = result.rows[0].firmwareId;
        var fileDir = db.file_server_url + "/" + req.session.vendorName + "/firmware/" + firmwareId;

        console.log("firmwareDir="+fileDir);

        var updateStr = "UPDATE firmware_table SET \"firmwareDir\"='" 
                    + fileDir + "' WHERE \"firmwareId\"='" + firmwareId + "';";

        console.log(updateStr);

        myClient.query(updateStr, function(err, result) {
            if (err) {
                console.error(err.stack);
                return;
            }

            if (result.rowCount == 1) {
                console.log("update firmware table success.");
            }
            else {
                console.log("update firmware table fails.");
                ret = 1;
            }

            var retStr = {
                    firmwareId: firmwareId,
                    ret: ret 
                };
            res.send(JSON.stringify(retStr));

        });

        var upStr = "UPDATE iot_dev_datamodel SET \"firmwareId\"='"
            + firmwareId
            + "' WHERE \"dataModelId\"='"
            + req.body.dataModelId
            + "';";

        console.log(upStr);

        myClient.query(upStr, function(err, result) {
            if (err) {
                console.error(err.stack);
                return;
            }
        });
    });
}

function addFirmwareVersion(req, res)
{
    var insertStr = "INSERT INTO firmware_version (\"firmwareId\", \"version\", \"changeLog\", \"fileName\", md5) "
            + "VALUES('" + req.body.firmwareId + "', '"
            + req.body.version + "', '"
            + req.body.versionDesc + "', '"
            + req.file.originalname + "', '"
            + req.body.md5
            + "');";

    console.log(insertStr);

    myClient.query(insertStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }
        if (result.rowCount == 1) {
            console.log("add firmware_version success.");

            var retStr = { ret: 0 };

            res.send(JSON.stringify(retStr));
        }
    });

}

function deleteFirmware(req, res, next)
{
    console.log("Enter deleteFirmware");
    console.log(req.body);
    console.log("vendorID=" + req.session.vendorID + ",vendorName=" + req.session.vendorName);

    var firmwareId = req.body.firmwareId;
    var vendorID = req.session.vendorID;

    var queryStr = "DELETE FROM firmware_version" 
                  + " WHERE \"firmwareId\"='"
                  + firmwareId
                  + "';";

    console.log(queryStr);

    myClient.query(queryStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }

        var deleteStr = "DELETE FROM firmware_table"
                + " WHERE \"firmwareId\"='" + firmwareId 
                + "' AND \"vendorId\"='" + vendorID
                + "';";

        console.log(deleteStr);

        myClient.query(deleteStr, function(err, result) {
            if (err) {
                console.error(err.stack);
                return;
            }

            var retStr = { ret: 0 };

            res.send(JSON.stringify(retStr));
        });
    });

}

function deleteVersion(req, res, next)
{
    console.log("Enter deleteVersion");
    console.log(req.body);
    
    var firmwareId = req.body.firmwareId;
    var version = req.body.version;

    var queryStr = "DELETE FROM firmware_version" 
                  + " WHERE \"firmwareId\"='"
                  + firmwareId + "' AND version='"
                  + version
                  + "';";

    console.log(queryStr);

    myClient.query(queryStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }

        var retStr = { ret: 0 };

        res.send(JSON.stringify(retStr));
    });

}

function queryFirmwareVersion(req, res, next) {
    console.log("Enter query firmware version");
    console.log(req.body);

    var values = new Array();

    var selectStr = "SELECT * FROM firmware_version WHERE \"firmwareId\"='" + req.body.firmwareId + "';";

    myClient.query(selectStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }

        result.rows.forEach(function(row) {
            var value = {
                version: row.version,
                changeLog: row.changeLog,
                createTime: row.createTime,
                md5: row.md5
            };

            values.push(value);
        }); 

        var queryStr = "SELECT \"publishVersion\" FROM firmware_table"
                        + " WHERE \"firmwareId\"='" + req.body.firmwareId + "';";

        console.log(queryStr);

        myClient.query(queryStr, function(err, result1) {
            if (err) {
                console.error(err.stack);
                return;
            }

            var version = result1.rows[0].publishVersion;

            var retStr = {
                ret: 0,
                firmwareId: req.body.firmwareId,
                publishVersion: version,
                values: values
            };

            res.send(JSON.stringify(retStr));
        });

    });
}

function queryFirmware(req, res, next) {
    console.log("Enter query firmware");
    console.log(req.body);

    var dataModelId = req.body.dataModelId;

    var selectStr = "SELECT "
                + "firmware_table.\"firmwareId\",firmware_table.\"firmwareName\",firmware_table.\"firmwareDesc\" "
                + "FROM (firmware_table JOIN iot_dev_datamodel ON "
                + "firmware_table.\"firmwareId\"=iot_dev_datamodel.\"firmwareId\") "
                + "WHERE "
                + "iot_dev_datamodel.\"dataModelId\"='" + dataModelId + "';";

    console.log(selectStr);

    myClient.query(selectStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
        }

        var value;
        var ret = 0;

        if (result.rowCount == 1) {
            value = {
                firmwareId: result.rows[0].firmwareId,
                firmwareName: result.rows[0].firmwareName,
                firmwareDesc: result.rows[0].firmwareDesc
            };
        }
        else {
            ret = 1;
        }

        var retStr = {
            ret: ret,
            values: value
        };

        res.send(JSON.stringify(retStr));
    });
}

function publishVersion(req, res, next) {
    console.log("Enter publish verison");
    console.log(req.body);

    var firmwareId = req.body.firmwareId;
    var version = req.body.version;

    var updateStr = "UPDATE firmware_table"
                    + " SET \"publishVersion\"='"
                    + version + "' WHERE \"firmwareId\"='"
                    + firmwareId
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

module.exports.queryAllFirmware = queryAllFirmware;
module.exports.addFirmware = addFirmware;
module.exports.deleteFirmware = deleteFirmware;
module.exports.deleteVersion = deleteVersion;
module.exports.addFirmwareVersion = addFirmwareVersion;
module.exports.queryFirmwareVersion = queryFirmwareVersion;
module.exports.queryFirmware = queryFirmware;
module.exports.publishVersion = publishVersion;
