var mysql   = require('mysql');
var db = require('db');
var client = mysql.createConnection(db.mysql);
 
client.connect();
 
// 增加记录
//client.query('insert into vendor value(5,"dlg","111111","140@qq.com")');
 
// 删除记录
//client.query('delete from test where username = "lupeng"');
 
// 修改记录
//client.query('update test set username = "pengloo53" where username = "lupeng"');
 
// 查询记录
//client.query("select * from test" , function selectTable(err, rows, fields){

//var username="lzl";
var username='1212';
var password='2121212121';
var email='2@qq.com';
//var selectStr = 'select * from vendor';
var insertStr='insert into vendor(username,password,email) values("'+ username+'","'+password+'","'+email+'")';
client.query(insertStr);
/*client.query(insertStr,function(err,result){
	console.log(insertStr);

	if(err){
		console.error(err.stack);
				//send_result(res,1,"数据库查询错误！");
                return;


	}*/

	var selectStr='select vendorId from vendor where username="'+username+'" and password="'+password+'" ';
	console.log(selectStr);
	client.query(selectStr,function(err,results){



		console.log(results[0].vendorId)

		console.log(results.length);
	});
	
	
	// console.log(JSON.stringify(result[0]));
	// console.log(result[0].vendorId);
	/*for (var i = 0;i<result.length;i++) {
		var value={

			username:result[i].username,
			password:result[i].password
		};

			console.log(value);

		}
*/
	//var results=JSON.stringify(result)
	//console.log(JSON.stringify(result));
		//console.log(result);
	// console.log(result[0].username);
	// console.log(result[0].password);
	// console.log(result[0].vendorId);



	 
	



 