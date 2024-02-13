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

app.listen(port, () => console.log(`[i] Server is running at :${port}`))