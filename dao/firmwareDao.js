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

    });
}

function addFirmwareVersion(req, res)
{
    var insertStr = "INSERT INTO firmware_version (\"firmwareId\", \"version\", \"changeLog\", \"fileName\") "
            + "VALUES('" + req.body.firmwareId + "', '"
            + req.body.version + "', '"
            + req.body.versionDesc + "', '"
            + req.file.originalname
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

    var updateStr = "UPDATE firmware_table SET \"newestVersion\"='" + req.body.version
            + "' WHERE \"firmwareId\"='" + req.body.firmwareId + "';";
    console.log(updateStr);

    myClient.query(updateStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            return;
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

module.exports.queryAllFirmware = queryAllFirmware;
module.exports.addFirmware = addFirmware;
module.exports.deleteFirmware = deleteFirmware;
module.exports.addFirmwareVersion = addFirmwareVersion;
