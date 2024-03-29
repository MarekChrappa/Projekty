const port = 8080;
const fs = require('fs');
const mysql = require('mysql');
var express = require('express');
var app = express();
var cors = require('cors')
var crypto = require('crypto');

app.use(cors())

let connectionMade = false;
let connection = null;
function connectDB() {//pripojenie na db
    if(connectionMade===false) {
        connection = mysql.createConnection({
            host     : process.env.HOST,
            user     : process.env.USER,
            password : process.env.PASSWORD,
            database : process.env.NAME
        });
        connection.connect(err =>{
            if(!err) {
                connectionMade = true;
            }
        });
    }
}

//get request na zobrazenie zoznamu miest
app.get('/places/type/:placetype', function (req, res) {
    console.log('/places/type/'+req.params.placetype);
        connectDB();
        res.statusCode = 200; // HTTP OK
        res.setHeader('Content-Type', 'application/json');
        res.setHeader("Access-Control-Allow-Origin", "*");
        connection.query('SELECT name,shortDescription,photo,uniqueID FROM Places WHERE placeType ='+ req.params.placetype, function (error, results, fields) {
            if (error) {
                res.statusCode = 500;
                res.end('DB ERROR');
            }
            console.log(results);
            res.end(JSON.stringify({
                placetype: req.params.placetype,
                places: results
            }));
        });
});

//get request na zobrazenie konkretneho miesta
app.get('/places/data/:placeid', function (req, res) {
    console.log('/places/data/'+req.params.placeid);
        connectDB();
        res.statusCode = 200; // HTTP OK
        res.setHeader('Content-Type', 'application/json');
        res.setHeader("Access-Control-Allow-Origin", "*");
        connection.query('SELECT name,shortDescription,longDescription,photo,location,uniqueID FROM Places WHERE uniqueID ='+req.params.placeid, function (error, results, fields) {
            if (error) {
                res.statusCode = 500;
                res.end('DB ERROR');
            }
            console.log(results);
            res.end(JSON.stringify({
                place: results[0]
            }));
        });
});

//get request na zobrazenie recenzií
app.get('/places/reviews/:placeid', function (req, res) {
    console.log('/places/reviews/'+req.params.placeid);
        connectDB();
        res.statusCode = 200; // HTTP OK
        res.setHeader('Content-Type', 'application/json');
        res.setHeader("Access-Control-Allow-Origin", "*");
        connection.query('SELECT userUsername,reviewText,revPhoto,rating,reviewID,userUID FROM Reviews WHERE placeUID ='+req.params.placeid, function (error, results, fields) {
            if (error) {
                res.statusCode = 500;
                res.end('DB ERROR');
            }
            console.log(results);
            res.end(JSON.stringify({
                placeID: req.params.placeid,
                reviews: results
            }));
        });
});

//post na vlozenie noveho miesta
app.post('/places/create/:placetype/:userid', function (req, res) {
    connectDB();
    console.log('POST received');
    if(parseInt(req.params.userid)>0){
        req.on('data', function(data){
            let input = JSON.parse(data);
            res.setHeader('Content-Type', 'application/json');
            connection.query("INSERT INTO Places (name, shortDescription, longDescription, photo, placeType, location) VALUES \
            ('"+input.name+"','"+input.shortDescription+"','"+input.longDescription+"','"+input.photo+"','"+req.params.placetype+"','"+input.location+"');", 
            function (error, results) {
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
    }
    else{
        res.statusCode = 401;
        res.end(JSON.stringify({'status': 'unauthorized'}));
    }
});

//post na vlozenie recenzií
app.post('/places/reviews/create/:placeid/:userid', function (req, res) {
    connectDB();
    console.log('POST received');
    if(parseInt(req.params.userid)>0){
        req.on('data', function(data){
            let input = JSON.parse(data);
            res.setHeader('Content-Type', 'application/json');
            connection.query("INSERT INTO Reviews (placeUID, userUsername, reviewText, revPhoto, rating, userUID) VALUES \
            ('"+req.params.placeid+"','"+input.userUsername+"','"+input.reviewText+"','"+input.revPhoto+"','"+input.rating+"' ,'"+req.params.userid+"');", 
            function (error, results) {
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
    }
    else{
        res.statusCode = 401;
        res.end(JSON.stringify({'status': 'unauthorized'}));
    }
});

//put na upravu miesta
app.put('/places/edit/:placeid/:userid', function (req, res) {
    connectDB();
    console.log('POST received');
    req.on('data', function(data){
        let input = JSON.parse(data);
        res.setHeader('Content-Type', 'application/json');
        connection.query("SELECT isAdmin from Users WHERE userUID = "+req.params.userid
        , function (error, results) {
            if (error) {
                res.statusCode = 500;
                console.log(error)
                res.end(JSON.stringify({
                    'status': 'error'
                }));
            }
            if(results[0].isAdmin){
                connection.query("UPDATE Places SET \
                uniqueID = '"+req.params.placeid+"', \
                name = '"+input.name+"', \
                shortDescription = '"+input.shortDescription+"', \
                longDescription = '"+input.longDescription+"', \
                photo = '"+input.photo+"', \
                placeType = '"+input.placeType+"', \
                location = '"+input.location+"' \
                WHERE uniqueID = "+req.params.placeid+""
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
            }
            else{
                res.statusCode = 401;
                res.end(JSON.stringify({'status': 'unauthorized'}));
            }
        });
        
    });
});

//delete na vymazanie recenzií
app.delete('/places/reviews/delete/:reviewid/:userid', function (req, res) {
    connectDB();
    console.log('DELETE received');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    connection.query("SELECT isAdmin from Users WHERE userUID = "+req.params.userid
    , function (error, results) {
        if (error) {
            res.statusCode = 500;
            console.log(error)
            res.end(JSON.stringify({
                'status': 'error'
            }));
        }
        if(results[0].isAdmin){
            connection.query('DELETE FROM Reviews WHERE reviewID = ' +req.params.reviewid, function (error, results) {
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
        }
        else{
            res.statusCode = 401;
            res.end(JSON.stringify({'status': 'unauthorized'}));
        }
    });
});

//delete na odstranenie miesta
app.delete('/places/delete/:placeid/:userid', function (req, res) {
    connectDB();
    console.log('DELETE received');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    connection.query("SELECT isAdmin from Users WHERE userUID = "+req.params.userid
    , function (error, results) {
        if (error) {
            res.statusCode = 500;
            console.log(error)
            res.end(JSON.stringify({
                'status': 'error'
            }));
        }
        if(results[0].isAdmin){
            connection.query('DELETE FROM Places WHERE uniqueID = ' +req.params.placeid, function (error, results) {
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
        }
        else{
            res.statusCode = 401;
            res.end(JSON.stringify({'status': 'unauthorized'}));
        }
    });
});

//post na registraciu pouzivatela
app.post('/users/register', function (req, res) {
    connectDB();
    console.log('POST received');
    req.on('data', function(data){
        let input = JSON.parse(data);
        res.setHeader('Content-Type', 'application/json');
        connection.query("INSERT INTO Users (username, pwHash, isAdmin) VALUES \
        ('"+input.username+"','"+crypto.createHash('md5').update(input.pw).digest('hex')+"','0');", 
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

//post na prihlasenie pouzivatela
app.post('/users/login', function (req, res) {
    connectDB();
    console.log('GET received');
    req.on('data', function(data){
        let input = JSON.parse(data);
        res.setHeader('Content-Type', 'application/json');
        connection.query("SELECT username,pwHash,isAdmin,userUID FROM Users WHERE \
        username = '"+input.username+"'", 
        function (error, results) {
            if (error) {
                res.statusCode = 500;
                console.log(error)
                res.end(JSON.stringify({
                    'status': 'error'
                }));
            }
            else{
                try{
                    if(crypto.createHash('md5').update(input.pw).digest('hex') == results[0].pwHash){
                        res.statusCode = 200;
                        res.end(JSON.stringify({'status': 'logged', 'admin': results[0].isAdmin, 'UID': results[0].userUID}));
                    }
                    else{
                        res.statusCode = 401;
                        res.end(JSON.stringify({'status': 'badPW'}));
                    }
                } catch (error){
                    res.statusCode = 401;
                    res.end(JSON.stringify({'status': 'badname'}));
                }
            }
        });
    });
});

//get na shoutbox
app.get('/shoutbox/data', function (req, res) {
    console.log('/shoutbox/data');
        connectDB();
        res.statusCode = 200; // HTTP OK
        res.setHeader('Content-Type', 'application/json');
        res.setHeader("Access-Control-Allow-Origin", "*");
        connection.query('SELECT user,text,timestamp,textID FROM Shoutbox', function (error, results, fields) {
            if (error) {
                res.statusCode = 500;
                res.end('DB ERROR');
            }
            console.log(results);
            res.end(JSON.stringify({
                shoutbox: results
            }));
        });
});

//post na shoutbox
app.post('/shoutbox/data/:userid', function (req, res) {
    connectDB();
    console.log('POST received');
    if(parseInt(req.params.userid)>0){
        req.on('data', function(data){
            let input = JSON.parse(data);
            res.setHeader('Content-Type', 'application/json');
            connection.query("INSERT INTO Shoutbox (user, userID, text, timestamp) VALUES \
            ('"+input.userUsername+"','"+req.params.userid+"','"+input.text+"','"+new Date().toISOString().slice(0, 19).replace('T', ' ')+"');", 
            function (error, results) {
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
    }
    else{
        res.statusCode = 401;
        res.end(JSON.stringify({'status': 'unauthorized'}));
    }
});

//delete zo shoutboxu
app.delete('/shoutbox/delete/:userid/:textid', function (req, res) {
    connectDB();
    console.log('DELETE received');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader("Access-Control-Allow-Origin", "*");
    connection.query("SELECT isAdmin from Users WHERE userUID = "+req.params.userid
    , function (error, results) {
        if (error) {
            res.statusCode = 500;
            console.log(error)
            res.end(JSON.stringify({
                'status': 'error'
            }));
        }
        if(results[0].isAdmin){
            connection.query('DELETE FROM Shoutbox WHERE textID = ' +req.params.textid, function (error, results) {
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
        }
        else{
            res.statusCode = 401;
            res.end(JSON.stringify({'status': 'unauthorized'}));
        }
    });
});

//get na placetypes
app.get('/placetypes', function (req, res) {
    console.log('/placetypes');
        connectDB();
        res.statusCode = 200; // HTTP OK
        res.setHeader('Content-Type', 'application/json');
        res.setHeader("Access-Control-Allow-Origin", "*");
        connection.query('SELECT * FROM Placetypes', function (error, results, fields) {
            if (error) {
                res.statusCode = 500;
                res.end('DB ERROR');
            }
            console.log(results);
            res.end(JSON.stringify({
                placetypes: results
            }));
        });
});

app.listen(port, function () {
    console.log('Example app listening on port 3000.');
});
