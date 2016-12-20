var pg = require('pg');
var db = require('db');
var fs = require('fs');
var pgString = db.consqlString;
var myClient = new pg.Client(pgString);

myClient.connect();

function updateCode(req, res) {
    console.log("update lirc code");

    var vendorID = req.session.vendorID;
    var ret;

    var url = db.file_server_url + '/' + req.session.vendorName
                + '/lirc/' + req.body.version
                + '/' + req.file.originalname;

    console.log("download url:" +  url);

    var insertStr = "INSERT INTO lirc_code(version, \"downloadUrl\", \"vendorId\") VALUES('"
        + req.body.version + "', '"
        + url + "', '"
        + vendorID
        + "') RETURNING id;";

    console.log(insertStr);

    myClient.query(insertStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            ret = 1;
        }
        else {
            var id = result.rows[0].id;
            ret = 0;
        }

        var retStr = {
            ret: ret,
            id: id
        };

        res.send(JSON.stringify(retStr));
    });

}


function deleteCode(req, res, next) {
    console.log("delete lirc code");

    var ret;

    var deleteStr = "DELETE FROM lirc_code WHERE version='"
        + req.body.version
        + "';";

    console.log(deleteStr);

    myClient.query(deleteStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            ret = 1;
        }
        else {
            ret = 0;
        }

        var retStr = {ret: ret};
        res.send(JSON.stringify(retStr));
    });
}


function queryAllCode(req, res, next) {
    console.log("query all lirc code");

    var ret;
    var vendorID = req.session.vendorID;
    var values = new Array();

    var queryStr = "SELECT * FROM lirc_code WHERE \"vendorId\"='"
        + vendorID
        + "';";

    console.log(queryStr);

    myClient.query(queryStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            var retStr = {ret: 1};
        }
        else {
            result.rows.forEach(function(row) {
                var value = {
                    id: row.id,
                    version:row.version
                };

                values.push(value);
            });
            
            var retStr = {
                ret: 0,
                values: values
            };
        }

        res.send(JSON.stringify(retStr));

    });
}

function queryAllDev(req, res, next) {
    console.log("query all lirc device");
    console.log(req.body);

    var ret;
    var values = new Array();
    var devType = req.body.devType;

    var queryStr = "SELECT manufacture,array_agg(\"modelName\") FROM lirc_device WHERE \"devType\"='"
        + devType + "' GROUP BY manufacture;";

    console.log(queryStr);

    myClient.query(queryStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            ret = 1;
        }
        else {
            ret = 0;
            result.rows.forEach(function(row) {
                var value = {
                    manufacture: row.manufacture,
                    modelName: row.array_agg
                };

                console.log(JSON.stringify(value));
                values.push(value);
            });
        }

        var retStr = {
            ret: ret,
            devType: devType,
            values: values 
        };

        res.send(JSON.stringify(retStr));
    });
}

function deleteDev(req, res, next) {
    console.log("Delete lirc device");
    console.log(req.body);

    var ret;

    var deleteStr = "DELETE FROM lirc_device WHERE \"lircId\"='"
        + req.body.lircId
        + "';";

    console.log(deleteStr);

    myClient.query(deleteStr, function(err, result) {
        if (err) {
            console.error(err.stack);
            ret = 1;
        }
        else {
            ret = 0;
        }

        var retStr = {ret: ret};
        res.send(JSON.stringify(retStr));
    });
}

function addDev(req, res, next) {
    console.log("Add lirc device");
    console.log(req.body);

    var ret;
    var retStr;

    var selectStr = "SELECT * FROM lirc_device WHERE \"devType\"='"
        + req.body.devType + "' AND manufacture='"
        + req.body.manufacture + "' AND \"modelName\"='"
        + req.body.modelName + "';";

    console.log(selectStr);

    myClient.query(selectStr, function(err, result) {
        if (err) {
            console.error(err.stack);
        }
        else {
            if (result.rowCount != 0) {
                console.log("lirc device is already existed");
            }
            else {
                var insertStr = "INSERT INTO lirc_device(\"devType\",manufacture,\"modelName\") VALUES('"
                        + req.body.devType + "', '"
                        + req.body.manufacture + "', '"
                        + req.body.modelName + "') RETURNING \"lircId\";";

                console.log(insertStr);

                myClient.query(insertStr, function(err, result1) {
                    if (err) {
                        console.error(err.stack);
                        ret = 1;
                    }
                    else {
                        ret = 0;
                    }

                    retStr = {
                        ret: ret,
                        lircId: result1.rows[0].lircId
                    };

                    res.send(JSON.stringify(retStr));
                });
            }
        }
    });
}
module.exports.updateCode = updateCode;
module.exports.deleteCode = deleteCode;
module.exports.queryAllCode = queryAllCode;
module.exports.queryAllDev = queryAllDev;
module.exports.deleteDev = deleteDev;
module.exports.addDev = addDev;
