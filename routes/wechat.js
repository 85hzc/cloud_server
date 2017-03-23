var express = require('express');
var router = express.Router();
var crypto = require('crypto');
//var pg = require('pg');

var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var db = require('db');
var pgString = db.consqlString;

router.post('/list', function(req, res, next) {
	var poststr = req.body.HTTP_RAW_POST_DATA;
	var fromusername = poststr.FromUserName;
	var tousername = poststr.ToUserName;
	var date = new Date();
	var time = date.getTime();
	var msgtype = 'text';
	var returnhead = "<xml>
						<ToUserName><![CDATA[" + fromusername + "]]></ToUserName>
						<FromUserName><![CDATA[" + tousername + "]]></FromUserName>
						<CreateTime>" + time + "</CreateTime>
						<MsgType><![CDATA[" + msgtype + "]]></MsgType>
						<Content><![CDATA[";

	var returntail = "]]></Content>
						<FuncFlag>0</FuncFlag>
					</xml>";


	//pg.connect(pgString, function(err, client, done) {
        client.query("select equipname from tbluserdevice where username=$1", [fromusername], function(err, result) {
            
            var content = "";

            if (err){
                	content = "error db";
            } else {
                
                var count = result.rowCount;
                for(var i = 0; i < count; i++) {
                	content += (i+1) + "、" + result.rows[i].equipname + "\n";
                }
            }

            var returnstr = returnhead + content + returntail;
            res.end(returnstr);
            client.end();
        });
    });

});


module.exports = router;
