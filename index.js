const https = require('https');
const express = require('express');
const app = express();


const mysql      = require('mysql');
const connection = mysql.createConnection({
	host     : '127.0.0.3',
	user     : 'root',
	password : '12345',
	database : 'fininfo_bd'
});



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


connection.connect(function(err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		throw error;
	}
	console.log("Соединение с БД успешно запущено!");
	
	console.log('connected as id ' + connection.threadId);
	app.listen(3000, function () {
	  console.log('Example app listening on port 3000!');
	});
	
	
	
	
	const startDate = "2020.02.24";
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
	});
});


process.on('exit', function() {
	console.log('closing...');
	connection.end();
});
