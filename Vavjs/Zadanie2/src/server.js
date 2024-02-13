//Marek Chrappa

var express = require('express');
var app = express();
var cors = require('cors')
const path = require('path');
var bcrypt = require('bcryptjs');
const ws = require('ws');

//import { Game } from './game.js'
var Game = require('./game.js');

const csv = require('csvtojson');

const WebSocket = require('ws');
const { log } = require('util');
const { json } = require('express');
const wss = new WebSocket.Server({ port: 8082 });

//var gameClass = require('./game.js');
var game;

wss.on('connection', ws => {
console.log('New client connected');
  ws.onmessage = function (e) {
    var object = JSON.parse(e.data); // this is my sesion which i do want to play

    var data = [{ 
        "tagy": "div",
        "id": "id1",
        "innerTags": [
            {
            "tag":'p',
            "innerText":"Lorem ipsum"},
            {
            "tag":'button',
            "innerText":"Click me"}
        ],
    }]
      ws.send(JSON.stringify(data));
  };
});
const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', socket => {
  socket.on('message', message => console.log(message));
  console.log("here i am")
});


//USER DATABASE
Userdabasearray = [ // pridat id
    {
        id: 0,
        email: 'admin@admin.com',
        login: 'admin',
        password: '$2a$10$ol8DpLlxIjF/YQolrHvTceMaGWYPvcYP4Qt.luASlKfwRCrJzw8.q',
        fullname: 'admin',
        car: 2,
        maxScore: 6969,
        maxSpeed: 75,
        isAdmin: 1
    },
    {
        id: 1,
        email: 'admiin@admin.com',
        fullname: 'RingoStarr',
        login: 'marecek',
        maxSpeed: 0,
        maxScore: 0,
        car:      1,
        password: 'marecek',
        isAdmin: 0
    },
    {
        id: 2,
        email: 'admiin@admin.com',
        fullname: 'RingoStarr',
        login: 'LFC4:0FCB',
        maxSpeed: 0,
        maxScore: 0,
        car:      1,
        password: 'marecek',
        isAdmin: 0
    },
    ];

Gamedabasearray = [];

    var listOfGames = [];
    var max_game_id = 0;
app.use(cors())
app.use(express.static(`${__dirname}/public`));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

    app.get('/home', function (req, res) { //home
        console.log("home")

        var data = [
            {
            tag: 'button',
            type: 'text',
            id: 'Reg_button_1',
            text: 'Register',
            },
    
            {
            tag: 'button',
            type: 'text',
            id: 'Log_button_1',
            text: 'Login',
            },
    
            {
            tag: 'button',
            type: 'text',
            id: 'Play_button_1',
            text: 'Play',
            },

            {
            tag: 'button',
            type: 'text',
            id: 'Live_games',
            text: 'Live games',
            },

            {
            tag: 'button',
            type: 'text',
            id: 'Change_car',
            text: 'Change car',
            },
        ]
        res.send(data)
    });
    app.get('/showRegistration', function (req, res) { //registration_page
        var register = [
            { tag: 'h1', text: 'Registration' },
    
            { tag: 'label', text: 'email' },
    
            {
            tag: 'input',
            type: 'text',
            id: 'email',
            text: '',
            },

            { tag: 'label', text: 'name' },
    
            {
            tag: 'input',
            type: 'text',
            id: 'fullName',
            text: '',
            },
    
            { tag: 'label', text: 'login' },
    
            {
            tag: 'input',
            type: 'text',
            id: 'login',
            text: '',
            },
    
            { tag: 'label', text: 'heslo' },
    
            {
            tag: 'input',
            type: 'password',
            id: 'passWord1',
            text: '',
            },

            { tag: 'label', text: 'heslo' },

            {
                tag: 'input',
                type: 'password',
                id: 'passWord2',
                text: '',
            },

            {
            tag: 'button',
            type: 'text',
            id: 'Reg_button_2',
            text: 'registrovat',
            },
        ];
        console.log("register window")
        res.json(register); 
    });
    app.get('/showLogin', function (req, res) { //login_page
    var register = [
        { tag: 'h1', text: 'Login' },
  
        { tag: 'label', text: 'login' },
  
        {
          tag: 'input',
          type: 'text',
          id: 'login_user',
          text: '',
        },
  
        { tag: 'label', text: 'heslo' },
  
        {
          tag: 'input',
          type: 'password',
          id: 'passWord',
          text: '',
        },
  
        {
          tag: 'button',
          type: 'text',
          id: 'Log_button_2',
          text: 'Log in',
        },
      ];
        console.log("login window")
        res.json(register);
    });
    app.post('/ShowCar', function (req, res) { //

        var check1 = false;
        var check2 = false;
        var check3 = false;


        if(req.body.user_id == -1){
            check1 = true
        }
        else
        {
            Userdabasearray.forEach(element => {
                if(element.id == req.body.user_id)
                {
                    if(element.car == 1)
                        check1 = true
                    if(element.car == 2)
                        check2 = true
                    if(element.car == 3)
                        check3 = true
                }   
            });
        }
        
        var register = [
            { tag: 'h1', text: 'Change Car' },
      
            { tag: 'label', text: 'Car 1' },
      
            {
              tag: 'input',
              type: 'radio',
              id: 'car_1',
              text: 'cars',
              check: check1
            },
      
            { tag: 'label', text: 'Car2' },
      
            {
              tag: 'input',
              type: 'radio',
              id: 'car_2',
              text: 'cars',
              check: check2
            },

            { tag: 'label', text: 'Car3' },
      
            {
              tag: 'input',
              type: 'radio',
              id: 'car_3',
              text: 'cars',
              check: check3
            },
      
            {
              tag: 'button',
              type: 'text',
              id: 'Save_car',
              text: 'Save car',
            },
          ];
        console.log("Show Car window")
        res.json(register);
    });
    app.post('/addUser', function (req, res) { //add user to dabase
        
        help_us = req.body
        
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync( help_us.password, salt);

        
        var registered = true
        a = Userdabasearray.length - 1
        User_id = Userdabasearray[a].id + 1;
        const help = {
            id:       User_id,
            email:    help_us.email,
            login:    help_us.login,
            password: hash,
            fullname: help_us.fullName,
            car:          1,
            maxScore:     0,
            maxSpeed:     0,
            isAdmin:      0
        };
        
        console.log(help)
        console.log('POST received');

        Userdabasearray.forEach(element => { //tu zmena
            if(element.login == help.login || element.email == help.email)
                registered = false;
        });

        if(registered){
            Userdabasearray.push(help);
            console.log("user register")
            var register_json = [{ 
                register: 1,
            },]
        }
        else{
            console.log("user credentials are used")
            var register_json= [{ 
                register: 0,
            },]
        }
        res.send(register_json)

    
    });
    app.post('/login', async function (req, res) { // log user to dabase
        //var salt = bcrypt.genSaltSync(10);
        //var hash = bcrypt.hashSync(user.password, salt);
        help_us = req.body
        
        const user = {
          login:    help_us.login,
          password: help_us.password,
        };
        var logged = false;
        /*
        Userdabasearray.forEach(element => {
            if(element.login == user.login && element.password == user.password)
            {
                logged_user = element
                logged = true;
            }  
        });
        */
        let doMatch;

        for (let i = 0; i <  Userdabasearray.length; i++) {
            doMatch = await bcrypt.compare(help_us.password, Userdabasearray[i].password);
            if (Userdabasearray[i].login == user.login && doMatch == true) {
            
                logged_user = Userdabasearray[i]
                logged = true;
                break;
            }
        }

        if(logged){
            console.log("user logged")
            console.log(logged_user.car)
            var log_in = [{ 
                id: logged_user.id,
                logged: 1,
                maxSpeed: logged_user.maxSpeed,
                maxScore: logged_user.maxScore,
                isAdmin: logged_user.isAdmin,
                user_name: logged_user.login,
                car: logged_user.car
            },]
        }
        else{
            console.log("user not existing")
            var log_in = [{ 
                logged: 0
            },]
        }
        
        res.send(log_in)
    });
    app.post('/SaveCar', function (req, res) { // log user to dabase
    
        User_car = req.body.user_car
        User_id = req.body.user_id

        Userdabasearray.forEach(element => {
            if(element.id == User_id)
                element.car = User_car
        });

        var answer = [{ 
            status: 'ok'
        },]
            
        console.log(answer)
        res.send(answer)
    });
    app.get('/showAdmin', function(req,res){
        console.log("Admin buttons")

        var admin_page = [
            { tag: 'h1', text: 'Admin buttons' },

            {
            tag: 'button',
            type: 'text',
            id: 'Load_CSV',
            text: 'Load CSV',
            },

            {
            tag: 'button',
            type: 'text',
            id: 'Save_CSV',
            text: 'Save CSV',
            },

            {
            tag: 'button',
            type: 'text',
            id: 'All_players',
            text: 'All players',
            },
        ];
        console.log("Admin window send")
        res.send(admin_page);
    })
    app.post('/create_game', function(req,res){
        console.log("Create game")
        
        user_id = req.body.user_id
        user_car = req.body.user_car
        if(user_id ==  -1)
            user_name = 'NaN'
        else{
            Userdabasearray.forEach(element => {
                if(element.id == user_id){
                    user_name = element.login;
                }
            });
        }

        game = new Game(user_id,user_name,user_car,max_game_id);
        max_game_id++;
        var a = game.add_to_database()
        Gamedabasearray.push(a)
        listOfGames.push(game)
        game.start_game();
        var answer = [
            { GameID: game.game_id},
        ];
        res.send(answer);
    })
    app.post('/getpoints', function(req,res){
        game_id = req.body.Game_id
        for(i = 0; i < listOfGames.length; i++){
            if(listOfGames[i].game_id == game_id)
            {
                answer = listOfGames[i].getPoints()
                res.send(answer);
                break
            }
        };
    })
    app.post('/getScore', function(req,res){
        game_id = req.body.Game_id
        user_id = req.body.user_id
        for(i = 0; i < listOfGames.length; i++){
            if(listOfGames[i].game_id == game_id)
            {
                a = listOfGames[i].getScore()
                b = listOfGames[i].getSpeed()
                
                if(user_id == -1)
                {
                    answer = {
                        score: a,
                        speed: b,
                        maxspeed: 'NaN',
                        maxscore: 'NaN'
                    }
                }
                else{
                    for(i = 0; i < Userdabasearray.length; i++)
                    {
                        if(Userdabasearray[i].id == user_id)
                        {
                            if(a > Userdabasearray[i].maxScore)
                                Userdabasearray[i].maxScore = a
                            if(b > Userdabasearray[i].maxSpeed)
                                Userdabasearray[i].maxSpeed = b
                            answer = {
                                score: a,
                                speed: b,
                                maxspeed: Userdabasearray[i].maxSpeed,
                                maxscore: Userdabasearray[i].maxScore,
                            }
                        }
                    }
                }
                res.send(answer);
                break
            }
        };
    })
    app.post('/moveplayer', function(req,res){
        game_id = req.body.Game_id
        for(i = 0; i < listOfGames.length; i++){
            if(listOfGames[i].game_id == game_id)
            {
                listOfGames[i].movePlayer(req.body.move_player)
                break
            }
        };
        var answer = [
            { GameID: game.game_id},
        ];
        res.send(answer);
    })

    app.get('/getAllPlayers', function(req,res){
        res.send(Userdabasearray);
    });
    app.get('/getAllGames', function(req,res){
        res.send(Gamedabasearray);
    });
    app.post('/delete', function (req, res) {
        console.log('DELETE received');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader("Access-Control-Allow-Origin", "*");
        User_id = req.body.id
     
        Userdabasearray .forEach(function(element,index,object) {
            if(element.id == User_id)
                object.splice(index,1)
        });        
        res.statusCode = 200;
        res.end(JSON.stringify({'status': 'ok'}));
    });
    app.get('/loadCSV', async function(req,res){
        console.log(__dirname)
        const csv_file = await csv().fromFile(`${__dirname}/players.csv`);
        Userdabasearray = csv_file;
        console.log(Userdabasearray)
        res.end(JSON.stringify({'status': 'ok'}));
    });

app.listen(8080, function () {
    console.log('Example app listening on port 8080.');
});

app.listen(3000);