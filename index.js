const https = require('https');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const net = require('net');
const fs = require('fs');
const path = require('path');


const mysql      = require('mysql');
const connection = mysql.createConnection({
	host     : '127.0.0.3',
	user     : 'root',
	password : '12345',
	database : 'fininfo_bd'
});

app.use("/static", express.static(path.join(__dirname, '/static')));
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
	//console.log('login = ', login);
	//console.log('password = ', password);
	connection.query(`SELECT * FROM users WHERE LOGIN = '${login}' AND PASSWORD = '${password}';`, function (error, results, fields) {
		if (error) throw error;
		const amount = results.length;
		//console.log('amount = ', amount);
		if (amount === 0) {
			return res.send({success: false, error: "Имя пользователя или пароль неправильные!"});
		}
		const user = results[0];
		//console.log('user = ', user);
		res.send({success: true, user: user});
	});
});


app.post('/login', function (req, res) {
	//console.log('body = ', req.body);
	const login = req.body["login"] || "";
	const password = req.body["password"] || "";
	connection.query(`SELECT * FROM users WHERE LOGIN = '${login}' AND PASSWORD = '${password}';`, function (error, results, fields) {
		if (error) throw error;
		const amount = results.length;
		//console.log('amount = ', amount);
		if (amount === 0) {
			return res.send({success: false, error: "Имя пользователя или пароль неправильные!"});
		}
		const user = results[0];
		//console.log('user = ', user);
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

app.get('/rooms', function(req, res) {
	const query = `
		SELECT * FROM rooms;
	`;
	connection.query(query, function(error, results, fields) {
		if (error) throw error;
		const rooms = JSON.stringify(results);
		res.setHeader('content-type', 'application/json');
		res.send(rooms);
		//res.send("rooms ok!!!!");
	});
	
});

app.post('/create_room', function(req, res) {
	const roomTitle = req.body["room"] || "";
	if (!roomTitle) {
		return res.send({success: false});
	}
	const query = `
		INSERT INTO rooms(ID_ROOM, title) VALUES (
			DEFAULT, '${roomTitle}'
		);
	`;
	connection.query(query, function (error, results, fields) {
		if (error) throw error;
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

	//console.log('connected as id ' + connection.threadId);
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
		let body = Buffer.from('');
		socket.on('data', bytes => {
			body = Buffer.concat([body, bytes]);
			//console.log('Получено байт = ', bytes.length);
			//console.log('Всего байт в body = ', body.length)
			const sepIndex = body.lastIndexOf('\0');
			const userId = 8;
			if (sepIndex > -1) {
				const datas = body.slice(0, sepIndex).toString();
				body = body.slice(sepIndex + 1, body.length);
				for (data of datas.split("\0")) {
					const dataType = data[data.length-1];
					data = data.slice(0, data.length - 1);
					//console.log('!!!!');
					if (dataType === '\1') {
						//console.log('data = ', data);
						//console.log('string data = ', data.toString());
						data = JSON.parse(data);

						const text = data["text"];
						connection.query(`INSERT INTO messages(ID_USER, text) VALUES(${userId}, '${text}')`, function (error, results, fields) {
							if (error) throw error;
							//console.log('data = ', data);
							let newData = {
								"text": text,
								"user_id": userId,
								"user": "Вася",
								"image": ""
							};
							console.log('newData = ', data);
							newData = Buffer.from(JSON.stringify(newData)) + '\1' + '\0';
							tcpClients.forEach(client => {
								console.log("Отправка ...");
								client.write(newData);
							});
						});
					} else if (dataType === '\2') {
						//console.log('Что-то другое!!!');
						//console.log('Получено байт = ', bytes.length);
						//console.log('Всего байт = ', body.length)
						let buff = Buffer.from(data, 'base64');
						//console.log('Декодированных байт = ', decodedData.length);
						const filename = parseInt(Math.random() * 10**14).toString() + ".jpg";

						fs.writeFile(path.join('static', 'img', filename), buff, (error) => {
							if (error) throw err;
							connection.query(`INSERT INTO messages(ID_USER, text, image) VALUES(${userId}, '', '${filename}')`, function (error, results, fields) {
								let newData = {
									"text": "",
									"image": filename,
									"user_id": userId,
									"user": "Вася"
								};
								newData = Buffer.from(JSON.stringify(newData)) + '\1' + '\0';
								tcpClients.forEach(client => {
									console.log("Отправка картинки ...");
									client.write(newData);
								});
							});
						});
						//body = Buffer.from('');
						console.log('СОХРАНЕНО!!!');
					}

				}
			}

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

		connection.query(`SELECT * FROM messages;`, function (error, results, fields) {
			if (error) throw error;
			const messages = results;

			messages.forEach(message => {
				let data = {
					"text": message["text"],
					"user_id": message["ID_USER"],
					"user": "Вася",
					"image": message["image"] || ""
				};
				console.log('init data = ', data);
				data = Buffer.from(JSON.stringify(data)) + '\1' + '\0';
				socket.write(data);
			});

		});




		//socket.end('goodbye\n');
	}).on('error', (err) => {
		throw err;
	});



	server.listen(3001, () => {
	  console.log('opened server on', server.address());
	});




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
