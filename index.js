const https = require('https');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const net = require('net');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');

//установка соединения с БД
const mysql      = require('mysql');
const connection = mysql.createConnection({
	host     : '127.0.0.3',
	user     : 'root',
	password : '12345',
	database : 'fininfo_bd',
	multipleStatements: true
});

app.use("/static", express.static(path.join(__dirname, '/static')));
app.use(bodyParser());


// стартовая страница в вебе (заглушка)
app.get('/', function (req, res) {
	res.setHeader('content-type', 'text/html');
	res.send('Hello <b>World!</b>');
});

// получение списка учителей в json формате
app.get('/teachers', function (req, res) {
	connection.query('SELECT * FROM teachers', function (error, results, fields) {
		if (error) throw error;

		const teachers = JSON.stringify(results);
		res.setHeader('content-type', 'application/json');
		res.send(teachers);
	});
});

// получение списка дисциплин и данных тех, кто их ведет в json формате
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

// обработка логина в виде GET запросва (для тестирования)
app.get('/login', function (req, res) {
	const login = req.query["login"] || "";
	const password = req.query["password"] || "";
	connection.query(`SELECT * FROM users WHERE LOGIN = '${login}' AND PASSWORD = '${password}';`, function (error, results, fields) {
		if (error) throw error;
		const amount = results.length;
		if (amount === 0) {
			return res.send({success: false, error: "Имя пользователя или пароль неправильные!"});
		}
		const user = results[0];
		res.send({success: true, user: user});
	});
});

// обработка логина в POST запросе
app.post('/login', function (req, res) {
	const login = req.body["login"] || "";
	const password = req.body["password"] || "";
	connection.query(`SELECT * FROM users WHERE LOGIN = '${login}' AND PASSWORD = '${password}';`, function (error, results, fields) {
		if (error) throw error;
		const amount = results.length;
		if (amount === 0) {
			return res.send({success: false, error: "Имя пользователя или пароль неправильные!"});
		}
		const user = results[0];
		res.send({success: true, userId: user['ID_USER']});
	});
});


// обработка регистрации нового пользователя в GET запросе (для тестирования)
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
			SELECT LAST_INSERT_ID();
		`;
		connection.query(query, function (error, results, fields) {
			if (error) throw error;
			const userId = results[0].insertId;

			res.send({success: true, userId: userId});
		});
		
	});
});


// обработка регистрации нового пользователя в POST запросе
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
			SELECT LAST_INSERT_ID();
		`;
		connection.query(query, function (error, results, fields) {
			if (error) throw error;
			const userId = results[0].insertId;

			res.send({success: true, userId: userId});
		});
		
	});
});


// получение списка чат-комнат
app.get('/rooms', function(req, res) {
	const query = `
		SELECT * FROM rooms;
	`;
	connection.query(query, function(error, results, fields) {
		if (error) throw error;
		const rooms = JSON.stringify(results);
		res.setHeader('content-type', 'application/json');
		res.send(rooms);
	});
	
});

// создание новой чат-комнаты
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
		const newRoom = JSON.stringify(results);
		res.send({success: true, id: results.insertId, title: roomTitle});
	});
});

// изменение статуса пользователя
app.get('/admin', function (req, res) {
	const id = +req.query["id"] || -1;
	connection.query(`UPDATE users SET IS_ADMIN=1 WHERE ID_USER='${id}'`, function (error, results, fields) {
		if (error) throw error;
		res.send('ok');
	});
});

// получение формы для загрузки документа на сервер в браузере (для тестирования)
app.get('/document', function(req, res) {
	res.send(`
		<html>
			<head>
				<title>Добавить документ</title>
			</head>
			<body>
				<form action="/document" method="POST" enctype="multipart/form-data">
					<input type="file" name="file">
					<input type="submit" value="Отправить">
				</form>
			</body>
		</html>
	`);
});

// загрузка нового документа через браузер (для тестирования)
app.post('/document', function(req, res) {
	const form = formidable({ multiples: false });
	
	form.on('fileBegin', function(name, file) {
		var arr = file.name.split('.');
		var newName = arr.slice(0, arr.length - 1).join(".") + "-" + parseInt(Math.random()*10**12).toString() + '.' + arr[arr.length - 1];
		file.path = path.join(__dirname, 'static', 'files', newName);
	});
	
	form.parse(req, (err, fields, files) => {
		if (err) {
			console.log('ERROR!!!!!!!!!!!!!!!!!');
			throw err;
		}
		res.json({ fields, files });
    });
});


// получение списка всех документов
app.get('/documents', function(req, res) {
	fs.readdir(path.join(__dirname, "static", "files"), (err, files) => {
		const data = files.map(filename => ({"filename": filename}));
		res.send(data);
	});
});

// скачивание документа по его имени
app.get('/download/:filename', function(req, res) {
	try {
		const filename = req.params.filename;
		const filepath = path.join(__dirname, "static", "files", filename);
		res.download(filepath);
	} catch(err) {
		res.send('Нет такого файла');
	}
});


const tmpIds = {}; // нужно для сохранения связи картинок/файлов и идентификатора сообщения

// получение данных пользователя по его id
async function getUser(userId) {
	return new Promise((resolve, reject) => {
		connection.query(`SELECT * FROM users WHERE ID_USER=${userId};`, function (error, results, fields) {
			if (error) reject(error);
			resolve(results && results.length ? results[0] : null);
		});
	});
}

// устанавливаем соедение с БД
connection.connect(function(err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		throw err;
	}
	console.log("Соединение с БД успешно запущено!");
	
	// запуск веб-сервера
	app.listen(3000, function () {
	  console.log('Example app listening on port 3000!');
	});


	tcpClients = [];  // массив подключений через TCP
	// удаление из списка TCP соединения
	function removeTCPClient(socket) {
		const index = tcpClients.indexOf(socket);
		if (index > -1) {
			tcpClients.splice(index, 1);
		}
	}
	
	// создаем TCP сервер
	const server = net.createServer((socket) => {
		// подключается по TCP новый клиент
		console.log('Новый сокет!');
		tcpClients.push(socket);  // сохраняем клиента
		let body = Buffer.from('');  // данные из сокета клиента
		socket.on('data', async bytes => {
			// при получении новых данных из сокета дописываем их впеременную
			body = Buffer.concat([body, bytes]);
			
			// ищем специальный разделитель сообщений - нулевой байт
			const sepIndex = body.lastIndexOf('\0');
			
			// если специальный разделитель найден
			if (sepIndex > -1) {
				// получаем набор целых сообщений
				const datas = body.slice(0, sepIndex).toString();
				// сохраняем остаток
				body = body.slice(sepIndex + 1, body.length);
				// проходим в цикле по всем сообщениям, получив их разбиением байтов по нулевому байту
				for (data of datas.split("\0")) {
					// определяем тип данных по последнему байту
					const dataType = data[data.length-1];
					
					// само сообщение
					data = data.slice(0, data.length - 1);
					if (dataType === '\1') { // если тектовое сообщение
						// преобразуем в объект javascript
						data = JSON.parse(data);
						
						// тип текстового сообщения - новое или получение истории
						const dataType = data["type"];

						const userId = +data["userId"];
						const user = await getUser(userId);
						
						
						if (dataType === "new") { // если новое сообщение
							const text = data["text"]; // текст сообщения
							const roomId = data["roomId"]; // чат-комната
							const uid = data["uid"]; // уникальный номер сообщения для связи текстовой части с файловой
							let image = "";
							let file = "";
							// ищем, была ли загружена картинка или файл для этого сообщения
							if (tmpIds[uid] && tmpIds[uid]["image"]) {
								image = tmpIds[uid]["image"];
							}
							if (tmpIds[uid] && tmpIds[uid]["file"]) {
								file = tmpIds[uid]["file"];
							}
							
							// вставляем новое сообщение
							connection.query(`INSERT INTO messages(ID_USER, text, ID_ROOM, image, file) VALUES(${userId}, '${text}', ${roomId}, '${image}', '${file}')`, function (error, results, fields) {
								if (error) throw error;
								
								delete tmpIds[uid];
						
								
								let newData = {
									"text": text,
									"user_id": userId,
									"user": user['FIRST_NAME'] + " " + user['SECOND_NAME'],
									"image": image,
									"file": file
								};
								newData = Buffer.from(JSON.stringify(newData)) + '\1' + '\0';
								
								// отправляем все соединениям из этой комнаты новое сообщение
								tcpClients.forEach(client => {
									if (roomId === client.roomId) {
										console.log("Отправка ...");
										client.write(newData);
									}
								});
							});
						} else if (dataType === "init") { // если получаем историю сообщений
							const roomId = data["roomId"];
							socket.roomId = roomId;
							connection.query(`SELECT * FROM messages WHERE ID_ROOM=${roomId};`, function (error, results, fields) {
								if (error) throw error;
								const messages = results;

								messages.forEach(async message => {
									const user = await getUser(message["ID_USER"]);
									if (user) {
										let data = {
											"text": message["text"],
											"user_id": message["ID_USER"],
											"user": user['FIRST_NAME'] + " " + user['SECOND_NAME'],
											"image": message["image"] || "",
											"file": message["file"] || ""
										};
										data = Buffer.from(JSON.stringify(data)) + '\1' + '\0';
										socket.write(data);
									}
								});

							});
						}

						
					} else if (dataType === '\2') { // если это файловый тип данных
						const buff = Buffer.from(data);
						//разделить, отделяющий сам файл от метаданных о нем
						const delimiterIndex = buff.lastIndexOf('\3');
						
						
						if (delimiterIndex === -1) {
							throw new Error("Неправильный формат данных!!!");
						}
						
						// получаем в байтах сам файл и объект javascript из метаданных
						const fileData = Buffer.from(buff.slice(0, delimiterIndex).toString('ascii'), 'base64');
						const metaData = JSON.parse(Buffer.from(buff.slice(delimiterIndex + 1, buff.length).toString('utf-8'), 'base64').toString('utf-8'));
		
						const fileArr = metaData["filename"].split(".");
						
						// формируем имя и путь нового файла в заивисмости от его типа (картинка, документ)
						const filename = fileArr.slice(0, fileArr.length-1).join(".") + "-" + parseInt(Math.random()*10**14) + "." + fileArr[fileArr.length-1];
						const type = metaData["type"];
						const uid = metaData["uid"];
						if (tmpIds[uid] === undefined) {
							tmpIds[uid] = {};
						}
						tmpIds[uid][type] = filename;
						
						let fullpath;
						if (type === 'image') {
							fullpath = path.join('static', 'img', filename);
						} else {
							fullpath = path.join('static', 'files', filename);
						}

						// сохраянем файл
						fs.writeFile(fullpath, fileData, (error) => {
							if (error) throw err;
						});
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

		//socket.end('goodbye\n');
	}).on('error', (err) => {
		throw err;
	});

	server.listen(3001, () => {
	  console.log('opened server on', server.address());
	});
});
