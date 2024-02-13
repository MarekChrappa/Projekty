const mysql = require('mysql2')
const express = require('express')
const app = express()
const port = 8080

const connection = mysql.createPool({
  host: 'database',
  user: 'root',
  password: 'root',
  port: '3306',
  database: 'db',
})

app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type')

  next()
})

app.get('/image', async (req, res) => {
  const image = await new Promise((resolve) => {
    connection.query(`SELECT * FROM images WHERE id=${req.query?.id || 1}`, (err, result) => {
      if (err || !Array.isArray(result) || result.length === 0) {
        return resolve(null)
      }

      resolve(result[0])
    })
  })

  res.status(200).json(image).end()
})

app.get('/pouzivatelia', function (req, res) {
  console.log('/pouzivatelia');
      //connectDB();
      res.statusCode = 200; // HTTP OK
      res.setHeader('Content-Type', 'application/json');
      res.setHeader("Access-Control-Allow-Origin", "*");
      connection.query('SELECT * FROM pouzivatelia', function (error, results, fields) {
          if (error) {
              res.statusCode = 500;
              res.end('DB ERROR');
          }
          console.log(results);
          res.end(JSON.stringify({
              pouzivatelia: results
          }));
      });
});

app.post('/register', function (req, res) {
  console.log('POST received');
  req.on('data', function(data){
      let input = JSON.parse(data);
      res.setHeader('Content-Type', 'application/json');
      connection.query("INSERT INTO pouzivatelia (name, password, email, age, height) VALUES \
      ('"+input.username+"','"+ input.pw +"','"+input.email+"','"+input.age+"','"+input.height+"');", 
      function (error, results) {
          if (error) {
              res.statusCode = 500;
              console.log(error)
              res.end(JSON.stringify({
                  'status': 'error'
              }));
          }
          else{
              res.statusCode = 200;
              res.end(JSON.stringify({'status': 'ok'}));
          }
      });
  });
});

app.listen(port, () => console.log(`[i] Server is running at :${port}`))