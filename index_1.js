const https = require('https');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const net = require('net');


const mysql      = require('mysql');
const connection = mysql.createConnection({
	host     : '127.0.0.3',
	user     : 'root',
	password : '12345',
	database : 'fininfo_bd'
});


app.use(bodyParser());
app.get('/', function (req, res) {
	res.setHeader('content-type', 'text/html');
	
	res.send('Hello <b>World!</b>');
});

app.get('/teachers', function (req, res) {
	connection.query('SELECT * FROM teachers', function (error, results, fields) {
		if (error) throw error;
		
		const teachers = JSON.stringify(results);
		res.setHeader('content-type', 'application/json');
		res.send(teachers);
	});
});

app.get('/classes', function (req, res) {
	connection.query(`
		SELECT classes.*, CONCAT(teachers.SECOND_NAME, ' ', teachers.FIRST_NAME, ' ', teachers.THIRD_NAME) TEACHER_NAME, groups.GROUP_NAME
		FROM classes LEFT JOIN teachers ON classes.ID_TEACHER = teachers.ID_TEACHER
		LEFT JOIN groups ON classes.ID_GROUP = groups.ID_GROUP`, 
		function (error, results, fields) {
			if (error) throw error;
		
			const classes = JSON.stringify(results);
			res.setHeader('content-type', 'application/json');
			res.send(classes);
		});
});


app.get('/login', function (req, res) {
	const login = req.query["login"] || "";
	const password = req.query["password"] || "";
	console.log('login = ', login);
	console.log('password = ', password);
	connection.query(`SELECT * FROM users WHERE LOGIN = '${login}' AND PASSWORD = '${password}';`, function (error, results, fields) {
		if (error) throw error;
		const amount = results.length;
		console.log('amount = ', amount);
		if (amount === 0) {
			return res.send({success: false, error: "Имя пользователя или пароль неправильные!"});
		}
		const user = results[0];
		console.log('user = ', user);
		res.send({success: true, user: user});
	});
});


app.post('/login', function (req, res) {
	console.log('body = ', req.body);
	const login = req.body["login"] || "";
	const password = req.body["password"] || "";
	connection.query(`SELECT * FROM users WHERE LOGIN = '${login}' AND PASSWORD = '${password}';`, function (error, results, fields) {
		if (error) throw error;
		const amount = results.length;
		console.log('amount = ', amount);
		if (amount === 0) {
			return res.send({success: false, error: "Имя пользователя или пароль неправильные!"});
		}
		const user = results[0];
		console.log('user = ', user);
		res.send({success: true, user: user});
	});
});

app.get('/register', function (req, res) {
	const login = req.query["login"] || "";
	const password = req.query["password"] || "";
	const firstName = req.query["first_name"] || "";
	const secondName = req.query["second_name"] || "";
	const thirdName = req.query["third_name"] || "";
	
	connection.query(`SELECT * FROM users WHERE LOGIN = '${login}';`, function (error, results, fields) {
		if (error) throw error;
		const amount = results.length;
		if (amount > 0) {
			return res.send({success: false, error: "Такой логин уже есть!"});
		}
		
		const query = `
			INSERT INTO users(ID_USER, LOGIN, PASSWORD, FIRST_NAME, SECOND_NAME, THIRD_NAME, IS_ADMIN) VALUES (
				DEFAULT, '${login}', '${password}', '${firstName}', '${secondName}', '${thirdName}', FALSE
			);
		`;
		connection.query(query);
		res.send({success: true});
	});
});

app.post('/register', function (req, res) {
	const login = req.body["login"] || "";
	const password = req.body["password"] || "";
	const firstName = req.body["first_name"] || "";
	const secondName = req.body["second_name"] || "";
	const thirdName = req.body["third_name"] || "";
	
	connection.query(`SELECT * FROM users WHERE LOGIN = '${login}';`, function (error, results, fields) {
		if (error) throw error;
		const amount = results.length;
		if (amount > 0) {
			return res.send({success: false, error: "Такой логин уже есть!"});
		}
		
		const query = `
			INSERT INTO users(ID_USER, LOGIN, PASSWORD, FIRST_NAME, SECOND_NAME, THIRD_NAME, IS_ADMIN) VALUES (
				DEFAULT, '${login}', '${password}', '${firstName}', '${secondName}', '${thirdName}', FALSE
			);
		`;
		connection.query(query);
		res.send({success: true});
	});
});


app.get('/admin', function (req, res) {
	const id = +req.query["id"] || -1;
	connection.query(`UPDATE users SET IS_ADMIN=1 WHERE ID_USER='${id}'`, function (error, results, fields) {
		if (error) throw error;
		res.send('ok');
	});
});



connection.connect(function(err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		throw err;
	}
	console.log("Соединение с БД успешно запущено!");
	
	console.log('connected as id ' + connection.threadId);
	app.listen(3000, function () {
	  console.log('Example app listening on port 3000!');
	});
	
	
	tcpClients = [];
	function removeTCPClient(socket) {
		const index = tcpClients.indexOf(socket);
		if (index > -1) {
			tcpClients.splice(index, 1);
		}
	}
	const server = net.createServer((socket) => {
		console.log('new socket!!!');
		tcpClients.push(socket);
		socket.on('data', (data) => {
			console.log('new data!!!', data);
			console.log('string data = ', data.toString());
			tcpClients.forEach(client => {
				console.log("Отправка ...");
				client.write(Buffer.from(data.toString()));
			});
		});
		socket.on('close', () => {
			console.log('!!!close');
			removeTCPClient(socket);
		});
		socket.on('end', () => {
			console.log('!!!END');
			removeTCPClient(socket);
		});
		socket.on('error', (err) => {
			console.log('!!!ERROR', err);
			removeTCPClient(socket);
		});
		
		//socket.end('goodbye\n');
	}).on('error', (err) => {
		throw err;
	});


	server.listen(3001, () => {
	  console.log('opened server on', server.address());
	});
	
	
	
	// получение данных с вуза и их вывод (может быть понадобится для заполнения БД)
	/*const startDate = "2020.02.24";
	const finishDate = "2020.03.01";
	const url = `https://ruz.fa.ru/api/schedule/group/8892?start=${startDate}&finish=${finishDate}`;
	console.log('url = ', url);
	https.get(url, (resp) => {
		let data = '';

		resp.on('data', (chunk) => {
			data += chunk;
		});

		resp.on('end', () => {
			const obj = JSON.parse(data);
			//console.log("obj = ", obj);
		});
	});*/
});


process.on('exit', function() {
	console.log('closing...');
	connection.end();
});
