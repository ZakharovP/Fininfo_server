const express = require('express');
const formidable = require('formidable');
 
const app = express();
 
app.get('/document', (req, res) => {
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
 
app.post('/document', (req, res, next) => {
  const form = formidable({ multiples: true });
 
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    res.json({ fields, files });
  });
});
 
app.listen(8080, () => {
  console.log('Server listening on http://localhost:3000 ...');
});