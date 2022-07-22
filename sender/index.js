const express = require('express'),
  app = express(),
  cookieParser = require('cookie-parser');

const port = 7000;

app.use(cookieParser('secret-key'));

app.get('/set-cookie', (req, res) => {
  res.cookie('COOKIE-NAME', 'COOKIE-COOKIE-COOKIE-COOKIE-COOKIE');
  res.send('See in Cookie');
});

app.listen(port, () =>
  console.log(`Server listens http://localhost:${port}`)
);
