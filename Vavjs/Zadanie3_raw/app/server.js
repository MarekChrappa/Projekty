const mysql = require('mysql2')
const express = require('express')
const app = express()
const port = 8080
const csv = require('csvtojson');
var bcrypt = require('bcryptjs');

app.use(express.static(`${__dirname}/public`));

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

app.post('/measurement', function (req, res) {
    console.log('POST received');
    req.on('data', function(data){


        let input = JSON.parse(data);
        res.setHeader('Content-Type', 'application/json');

        if(input.type == 0)
        {
            connection.query("SELECT vahy.id, vahy.value, metody.name as 'activity', vahy.datetime, metody.id as mid FROM `vahy` LEFT JOIN metody on method_id = metody.id WHERE \
            UID = '"+input.id+"'" + "order by vahy.datetime",  
            function (error, results) {
                if (error) {
                    res.statusCode = 500;
                    console.log(error)
                    res.end(JSON.stringify({
                        'status': 'error'
                    }));
                }
                console.log(results);
                res.end(JSON.stringify({
                    merania: results
                }));
            });
        }

        if(input.type == 1)
        {
            connection.query("SELECT tep.id, tep.value, metody.name as 'activity', tep.datetime, metody.id as mid FROM `tep` LEFT JOIN metody on method_id = metody.id WHERE \
            UID = '"+input.id+"'" + "order by tep.datetime",  
            function (error, results) {
                if (error) {
                    res.statusCode = 500;
                    console.log(error)
                    res.end(JSON.stringify({
                        'status': 'error'
                    }));
                }
                console.log(results);
                res.end(JSON.stringify({
                    merania: results
                }));
            });
        }

        if(input.type == 2)
        {
            
            connection.query("SELECT kroky.id, kroky.value, metody.name as 'activity', kroky.datetime, metody.id as mid FROM `kroky` LEFT JOIN metody on method_id = metody.id WHERE \
            UID = '"+input.id+"'" + "order by kroky.datetime",  
            function (error, results) {
                if (error) {
                    res.statusCode = 500;
                    console.log(error)
                    res.end(JSON.stringify({
                        'status': 'error'
                    }));
                }
                console.log(results);
                res.end(JSON.stringify({
                    merania: results
                }));
            });
        }
    });
});

app.post('/all_measurement', function (req, res) {
    console.log('POST received');
    req.on('data', function(data){
        console.log('tu')
        let input = JSON.parse(data);
        res.setHeader('Content-Type', 'application/json');
        connection.query("SELECT id,name, description FROM `metody`",  
        function (error, results) {
            if (error) {
                res.statusCode = 500;
                console.log(error)
                res.end(JSON.stringify({
                    'status': 'error'
                }));
            }
            console.log(results);
            res.end(JSON.stringify({
                merania: results
            }));
        });
    });
});

app.post('/Add_value', function (req, res) {
    console.log('POST received');
    req.on('data', function(data){
        let input = JSON.parse(data);
        res.setHeader('Content-Type', 'application/json');
        console.log("wtf ", input.DateTime)
        if(input.type == 0)
        {
            connection.query("INSERT INTO vahy (value, UID, method_id, datetime) VALUES \
            ('"+input.value+"','"+input.id+"','"+input.method_id+"', '"+input.DateTime+"');",  
            function (error, results) {
                if (error) {
                    res.statusCode = 500;
                    console.log(error)
                    res.end(JSON.stringify({
                        'status': 'error'
                    }));
                }
                console.log(results);
                res.end(JSON.stringify({
                    merania: results
                }));
            });
        }

        if(input.type == 1)
        {
            connection.query("INSERT INTO tep (value, UID, method_id, datetime) VALUES \
            ('"+input.value+"','"+input.id+"','"+input.method_id+"', '"+input.DateTime+"');",  
            function (error, results) {
                if (error) {
                    res.statusCode = 500;
                    console.log(error)
                    res.end(JSON.stringify({
                        'status': 'error'
                    }));
                }
                console.log(results);
                res.end(JSON.stringify({
                    'status': 'ok'
                }));
            });
        }

        if(input.type == 2)
        {
            connection.query("INSERT INTO kroky (value, UID, method_id, datetime) VALUES \
            ('"+input.value+"','"+input.id+"','"+input.method_id+"', '"+input.DateTime+"');",  
            function (error, results) {
                if (error) {
                    res.statusCode = 500;
                    console.log(error)
                    res.end(JSON.stringify({
                        'status': 'error'
                    }));
                }
                console.log(results);
                res.end(JSON.stringify({
                    'status': 'ok'
                }));
            });
        }
    });
});
app.post('/Delete_value', function (req, res) {
    console.log('POST received');
    req.on('data', function(data){
        let input = JSON.parse(data);
        res.setHeader('Content-Type', 'application/json');

        if(input.type == 0)
        {
            connection.query('DELETE FROM vahy WHERE id = ' +input.id,  
            function (error, results) {
                if (error) {
                    res.statusCode = 500;
                    console.log(error)
                    res.end(JSON.stringify({
                        'status': 'error'
                    }));
                }
                console.log(results);
                res.end(JSON.stringify({
                    'status': 'ok'
                }));
            });
        }

        if(input.type == 1)
        {
            connection.query('DELETE FROM tep WHERE id = ' +input.id,  
            function (error, results) {
                if (error) {
                    res.statusCode = 500;
                    console.log(error)
                    res.end(JSON.stringify({
                        'status': 'error'
                    }));
                }
                console.log(results);
                res.end(JSON.stringify({
                    'status': 'ok'
                }));
            });
        }

        if(input.type == 2)
        {
            connection.query('DELETE FROM kroky WHERE id = ' +input.id,  
            function (error, results) {
                if (error) {
                    res.statusCode = 500;
                    console.log(error)
                    res.end(JSON.stringify({
                        'status': 'error'
                    }));
                }
                console.log(results);
                res.end(JSON.stringify({
                    'status': 'ok'
                }));
            });
        }        
    });
});

app.post('/Add_value_M', function (req, res) {
    console.log('POST received');
    req.on('data', function(data){
        let input = JSON.parse(data);
        res.setHeader('Content-Type', 'application/json');
        connection.query("INSERT INTO metody (name, description) VALUES \
        ('"+input.name+"','"+input.description+"');",  
        function (error, results) {
            if (error) {
                res.statusCode = 500;
                console.log(error)
                res.end(JSON.stringify({
                    'status': 'error'
                }));
            }
            console.log(results);
            res.end(JSON.stringify({
                merania: results
            }));
        });
    });
});
app.post('/Delete_value_M', function (req, res) {
    console.log('POST received');
    req.on('data', function(data){
        let input = JSON.parse(data);
        res.setHeader('Content-Type', 'application/json');
        connection.query('DELETE FROM metody WHERE id = ' +input.id,  
        function (error, results) {
            if (error) {
                res.statusCode = 500;
                console.log(error)
                res.end(JSON.stringify({
                    'status': 'error'
                }));
            }
            console.log(results);
            res.end(JSON.stringify({
                merania: results
            }));
        });
    });
});
app.get('/pouzivatelia', function (req, res) {
  console.log('/pouzivatelia');
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
app.post('/Delete_user', function (req, res) {
    console.log('POST received');
    req.on('data', function(data){
        let input = JSON.parse(data);
        res.setHeader('Content-Type', 'application/json');
        connection.query('DELETE FROM pouzivatelia WHERE id = ' +input.id,  
        function (error, results) {
            if (error) {
                res.statusCode = 500;
                console.log(error)
                res.end(JSON.stringify({
                    'status': 'error'
                }));
            }
            console.log(results);
            res.end(JSON.stringify({
                merania: results
            }));
        });
    });
});
app.post('/register', function (req, res) {
  console.log('POST received');
  req.on('data', function(data){
      let input = JSON.parse(data);
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync( input.password, salt);
      res.setHeader('Content-Type', 'application/json');
      connection.query("INSERT INTO pouzivatelia (name, password, email, age, height) VALUES \
      ('"+input.login+"','"+ hash +"','"+input.email+"','"+input.age+"','"+input.height+"');", 
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
app.post('/login', function (req, res) {
  console.log('POST received');
  req.on('data', function(data){
      let input = JSON.parse(data);
      res.setHeader('Content-Type', 'application/json');
      connection.query("SELECT id, name,password,age,height,isAdmin  FROM pouzivatelia WHERE \
      name = '"+input.login+"'", 
      async function (error, results) {
          if (error) {
              res.statusCode = 500;
              console.log(error)
              res.end(JSON.stringify({
                  'status': 'error'
              }));
          }
          else{
              try{
                  if(await bcrypt.compare(input.password, results[0].password)){
                        res.statusCode = 200;
                        console.log("logged")
                        var admin
                        if(results[0].isAdmin == 0)
                            admin = false
                        else
                            admin = true
                        res.end(JSON.stringify({'status': 'logged', 'admin': admin, 'UID': results[0].id}));
                  }
                  else{
                        res.statusCode = 401;
                        res.end(JSON.stringify({'status': 'badPassword'}));
                  }
              } catch (error){
                  res.statusCode = 401;
                  res.end(JSON.stringify({'status': 'badname'}));
              }
          }
      });
  });
});

app.post('/Delete_Add', function (req, res) {
    console.log('POST received');
    req.on('data', function(data){
        let input = JSON.parse(data);
        res.setHeader('Content-Type', 'application/json');
        connection.query('DELETE FROM reklamy WHERE id = ' +input.id,  
        function (error, results) {
            if (error) {
                res.statusCode = 500;
                console.log(error)
                res.end(JSON.stringify({
                    'status': 'error'
                }));
            }
            console.log(results);
            res.end(JSON.stringify({
                merania: results
            }));
        });
    });
});

app.post('/loadCSV', async function(req,res){

    const json = {
        method: 'POST',
        mode: 'cors',
        cache: 'default',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        }),
      };
    
    let response = await fetch(new Request('http://localhost:8080/all_measurement'), json);
    var response_json = await response.json()
    var measurement = response_json.merania

    const csv_file = await csv().fromFile(`${__dirname}/measurement.csv`);
    req.on('data', function(data){
    let input = JSON.parse(data);

    help = "2022-11-30 23:13:38"
    res.setHeader('Content-Type', 'application/json');
    for( var x in csv_file)
    {
        var method_id = 0
        for(var y in measurement){
            if(measurement[y].name == csv_file[x].method){
                method_id = measurement[y].id
                break
            }
        }

        if(csv_file[x].type == 'vaha')
        {
            connection.query("INSERT INTO vahy (value, UID, method_id, datetime) VALUES \
            ('"+csv_file[x].value+"','"+input.id+"','"+method_id+"', '"+csv_file[x].datetime+"');",  
            function (error, results) {
                if (error) {
                    res.statusCode = 500;
                    console.log(error)
                    res.end(JSON.stringify({
                        'status': 'error'
                    }));
                }
            });
        }

        if(csv_file[x].type == 'kroky')
        {
            connection.query("INSERT INTO kroky (value, UID, method_id, datetime) VALUES \
            ('"+csv_file[x].value+"','"+input.id+"','"+method_id+"', '"+help+"');",  
            function (error, results) {
                if (error) {
                    res.statusCode = 500;
                    console.log(error)
                    res.end(JSON.stringify({
                        'status': 'error'
                    }));
                }
            });
        }

        if(csv_file[x].type == 'tep')
        {
            connection.query("INSERT INTO tep (value, UID, method_id, datetime) VALUES \
            ('"+csv_file[x].value+"','"+input.id+"','"+method_id+"', '"+help+"');",  
            function (error, results) {
                if (error) {
                    res.statusCode = 500;
                    console.log(error)
                    res.end(JSON.stringify({
                        'status': 'error'
                    }));
                }
            });
        }
    }
    console.log(csv_file);
    
    res.end(JSON.stringify({'status': 'ok'}));
    });
});
app.get('/loadCSV_Users', async function(req,res){

    
    const csv_file = await csv().fromFile(`${__dirname}/users.csv`);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    for( var x in csv_file)
    {
        console.log('tuuuu')
        connection.query("INSERT INTO pouzivatelia (name, password, email, age, height) VALUES \
        ('"+csv_file[x].name+"','"+ csv_file[x].password +"','"+csv_file[x].email+"','"+csv_file[x].age+"','"+csv_file[x].height+"');", 
        function (error, results){
            if (error) {
                res.statusCode = 500;
                console.log(error)
                res.end(JSON.stringify({
                    'status': 'error'}))
            }
        });
    }

    console.log(csv_file);
    res.end(JSON.stringify({'status': 'ok'}));
});
app.get('/Return_Add', function (req, res) {
    console.log('/pouzivatelia');
        res.statusCode = 200; // HTTP OK
        res.setHeader('Content-Type', 'application/json');
        res.setHeader("Access-Control-Allow-Origin", "*");
        connection.query('SELECT * FROM reklamy', function (error, results, fields) {
            if (error) {
                res.statusCode = 500;
                res.end('DB ERROR');
            }
            console.log(results);
            if(results != null)
            {
                res.end(JSON.stringify({
                    adds: results
                }));
            }
            else
            {
                res.statusCode = 500;
                res.end('DB ERROR');
            }
            
        });
  });
app.put('/Update_Add', function (req, res){
    

    req.on('data', function(data){
    let input = JSON.parse(data);
    connection.query("UPDATE reklamy SET \
                counter  = '"+input.counter+"' \
                WHERE id = "+input.id+""
                , function (error, results) {
                    if (error) {
                        res.statusCode = 500;
                        console.log(error)
                        res.end(JSON.stringify({
                            'status': 'error',
                            'json': input
                        }));
                    }
                    else{
                        res.statusCode = 200;
                        res.end(JSON.stringify({'status': 'ok'}));
                    }
                });
    });
});

app.put('/Update_Add2', function (req, res){
    

    req.on('data', function(data){
    let input = JSON.parse(data);
    connection.query("UPDATE reklamy SET \
                url  = '"+input.url+"', \
                src  = '"+input.src+"' \
                WHERE id = "+input.id+""
                , function (error, results) {
                    if (error) {
                        res.statusCode = 500;
                        console.log(error)
                        res.end(JSON.stringify({
                            'status': 'error',
                            'json': input
                        }));
                    }
                    else{
                        res.statusCode = 200;
                        res.end(JSON.stringify({'status': 'ok'}));
                    }
                });
    });
});


app.post('/Add_Add', function (req, res) {
    console.log('POST received');
    req.on('data', function(data){
        let input = JSON.parse(data);
        res.setHeader('Content-Type', 'application/json');
        connection.query("INSERT INTO reklamy (src,url) VALUES \
        ('"+input.src+"','"+input.url+"');",  
        function (error, results) {
            if (error) {
                res.statusCode = 500;
                console.log(error)
                res.end(JSON.stringify({
                    'status': 'error'
                }));
            }
            console.log(results);
            res.end(JSON.stringify({
                merania: results
            }));
        });
    });
});

app.post('/measurement_graph', function (req, res) {
    console.log('POST received');
    req.on('data', function(data){


        let input = JSON.parse(data);
        res.setHeader('Content-Type', 'application/json');

        if(input.type == 0)
        {
            connection.query("SELECT vahy.id, vahy.value, metody.name as 'activity', metody.id as mid, vahy.datetime FROM `vahy` LEFT JOIN metody on method_id = metody.id WHERE \
            UID = '"+input.id+"'" + "order by vahy.datetime",  
            function (error, results) {
                if (error) {
                    res.statusCode = 500;
                    console.log(error)
                    res.end(JSON.stringify({
                        'status': 'error'
                    }));
                }
                console.log(results);
                res.end(JSON.stringify({
                    merania: results
                }));
            });
        }

        if(input.type == 1)
        {
            connection.query("SELECT tep.id, tep.value, metody.name as 'activity',metody.id as mid, tep.datetime FROM `tep` LEFT JOIN metody on method_id = metody.id WHERE \
            UID = '"+input.id+"'" + "order by tep.datetime",  
            function (error, results) {
                if (error) {
                    res.statusCode = 500;
                    console.log(error)
                    res.end(JSON.stringify({
                        'status': 'error'
                    }));
                }
                console.log(results);
                res.end(JSON.stringify({
                    merania: results
                }));
            });
        }

        if(input.type == 2)
        {
            
            connection.query("SELECT kroky.id, kroky.value, metody.name as 'activity', metody.id as mid, kroky.datetime FROM `kroky` LEFT JOIN metody on method_id = metody.id WHERE \
            UID = '"+input.id+"'" + "order by kroky.datetime",  
            function (error, results) {
                if (error) {
                    res.statusCode = 500;
                    console.log(error)
                    res.end(JSON.stringify({
                        'status': 'error'
                    }));
                }
                console.log(results);
                res.end(JSON.stringify({
                    merania: results
                }));
            });
        }
    });
});


app.listen(port, () => console.log(`[i] Server is running at :${port}`))