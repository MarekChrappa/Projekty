//Marek Chrappa
var maxSpeed;
var maxScore;
var isAdmin;
var user_car = 1;
var user_name = 'Free user';
var user_id = -1

var user_logged = false;


var ws = new WebSocket('ws://localhost:8082');
    ws.onmessage = function(event) {
        document.getElementById('num').value = 69;
    };

    //var btn = document.getElementById('Login');
    // --------- \\ 


    var gameWidth = 800; //tiles
    var gameHeight = 400; // tiles
    var size = 10; //px
    var roadSize = 6; //tiles

    var canv = document.createElement('canvas');
    canv.id = 'someId';
    canv.width = gameWidth;
    canv.height = gameHeight;
    ctx = canv.getContext('2d');
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, canv.width, canv.height);
    document.body.appendChild(canv);

    showHome()
    
    async function showHome(){

        const create_json = {
            method: 'GET',
            mode: 'cors',
            cache: 'default',
            headers: {
            'Content-Type': 'application/json',
            }
        };
        let response = await fetch(new Request('http://localhost:8080/home'), create_json);

        let translatedResponse = JSON_HTML(await response.json());

        let div = document.createElement('div');
        div.id = 'home_buttons';
        div.innerHTML = translatedResponse;
        document.body.appendChild(div);


        //canvas
        var admin_page = document.createElement('div');
        document.body.appendChild(admin_page);
        
        var login_page = document.createElement('div');
        document.body.appendChild(login_page);
        var register_page = document.createElement('div');
        document.body.appendChild(register_page);

        var players_page = document.createElement('div');
        players_page.id = 'players_page'
        document.body.appendChild(players_page);

        var games_page = document.createElement('div');
        games_page.id = 'games_page'
        document.body.appendChild(games_page); 


        //register
        var register = document.getElementById('Reg_button_1');
        register.onclick = function () {
            showRegister();
        };

        //login
        var login = document.getElementById('Log_button_1');
        login.onclick = function () {
            showLogin();
        };

        //play
        var play = document.getElementById('Play_button_1');
        play.onclick = function () {
            play_game();
        };

        //LiveGames
        var LiveGames = document.getElementById('Live_games');
        LiveGames.onclick = function () {
            console.log('here')
            show_all_games();
        };

        //Car
        var help = document.getElementById('Change_car');
        help.onclick = function () {
            showCar()
        };
    }
    async function play_game(){

        var div = document.createElement('h3');
        div.id = 'Score'
        div.textContent = 'Score ' + '0'
        document.body.appendChild(div);

        var div = document.createElement('h3');
        div.id = 'Speed'
        div.textContent = 'Speed ' +'0'
        document.body.appendChild(div);

        var div = document.createElement('h3');
        div.id = 'MaxScore'
        div.textContent = 'MaxScore ' + '0'
        document.body.appendChild(div);

        var div = document.createElement('h3');
        div.id = 'MaxSpeed'
        div.textContent = 'MaxSpeed ' + '0'
        document.body.appendChild(div);

        const create_json = {
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id, 
                user_car,
                play: true
              }),
        };

        url = 'http://localhost:8080/create_game'
        let response = await fetch(new Request(url), create_json);
        response_json = await response.json()
        Game_id = response_json[0].GameID

        var play = true

        

        const json = {
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Game_id
            }),
          };

        url = 'http://localhost:8080/getpoints'
        var i = 0

        move_player = 0;
        document.addEventListener('keydown',function(ev){
            if(ev.keyCode === 38) move_player--;
            else if(ev.keyCode === 40) move_player++;
        });

        while(play)
        {
            
            //ctx.fillStyle = "black";
            //ctx.fillRect(0, 0, canv.width, canv.height);
            if(i > 2)
            {
                i = 0;
                //undraw()
            }   
            else   
                i++

            response = await fetch(new Request(url), json);
            response_json = await response.json()

            if(response_json[0].draw == 0)
                play = false;
            else
                if(response_json[0].draw == 2)
                {
                    console.log('Start of Game' + response_json[0].draw )
                }
                else 
                    if(response_json[0].draw == 1){
                        for(i = 1; i < response_json.length; i++){
                            drawWithStyle(response_json[i].points, response_json[i].style,response_json[i].url)
                    }
                }
            
            if(move_player != 0){

                const move = {
                    method: 'POST',
                    mode: 'cors',
                    cache: 'default',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        Game_id,
                        move_player
                    }),
                  };
                response = await fetch(new Request('http://localhost:8080/moveplayer'), move);
                move_player = 0
            }
            const score = {
                method: 'POST',
                mode: 'cors',
                cache: 'default',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Game_id,
                    user_id
                }),
              };
            //console.log(user_id)

            response = await fetch(new Request('http://localhost:8080/GetScore'), score);
            response_json = await response.json()

            let help = document.getElementById('Score');
            help.textContent = 'Score ' + response_json.score

            help = document.getElementById('Speed');
            help.textContent = 'Speed ' + response_json.speed

            if(user_id == -1)
            {
                help = document.getElementById('MaxSpeed');
                help.textContent = 'MaxSpeed ' + response_json.speed

                help = document.getElementById('MaxScore');
                help.textContent = 'MaxScore ' + response_json.score
            }
            else
            {
                help = document.getElementById('MaxSpeed');
                help.textContent = 'MaxSpeed ' + response_json.maxspeed

                help = document.getElementById('MaxScore');
                help.textContent = 'MaxScore ' + response_json.maxscore
            }
              

        }
    }

    async function Watch_game(game_id)
    {
        var Game_id = game_id
        const json = {
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Game_id,
            }),
          };

        url = 'http://localhost:8080/getpoints'
        var i = 0
        var watch = true
        while(watch)
        {
            if(i == 1)
            {
                i = 0;
                undraw()
            }   
            else   
                i++

            response = await fetch(new Request(url), json);
            response_json = await response.json()
            console.log(response_json)

            if(response_json[0].draw == 0)
                watch = false;
            else
                if(response_json[0].draw == 2)
                {
                    console.log('Start of Game' + response_json[0].draw )
                }
                else 
                    if(response_json[0].draw == 1){
                        for(i = 1; i < response_json.length; i++){
                            drawWithStyle(response_json[i].points, response_json[i].style, response_json[i].url)
                    }
                }
        }
    }

    function undraw()
    {
        ctx.drawImage(GrassImage, 0,  0, canv.width, canv.height);  
        //ctx.fillStyle = "green";
        //ctx.fillRect(0, 0, canv.width, canv.height);
    }

    drawWithStyle = function(points,style,url) {
        for(var g=0;g<points.length;g++) {
            if(typeof points[g] !== 'undefined') {
                if(style != 'car')
                {
                    ctx.fillStyle = style
                    ctx.fillRect(points[g][0], points[g][1], 1,1); 
                }
                if(style == 'car')
                {
                    var PlayerImage = new Image();
                    PlayerImage.src = url;
                    ctx.drawImage(PlayerImage, points[g][0], points[g][1], 48, 48);
                    break
                }
                          
            }
        }
    }

    async function showRegister() { 
        const create_json = {
            method: 'GET',
            mode: 'cors',
            cache: 'default',
            headers: {
            'Content-Type': 'application/json',
            }
        };
        let response = await fetch(new Request('http://localhost:8080/showRegistration'), create_json);

        let translatedResponse = JSON_HTML(await response.json());

        let div = document.createElement('div');
        div.id = 'register_page';
        div.innerHTML = translatedResponse;
        document.body.appendChild(div);

        let help = document.getElementById('Reg_button_2');
        document.getElementById('Reg_button_1').disabled = true;
        help.onclick = async function () {
            
            let email = document.getElementById('email').value;
            let login = document.getElementById('login').value;
            let password = document.getElementById('passWord1').value;
            let password1 = document.getElementById('passWord2').value;
            let fullName = document.getElementById('fullName').value; 

            var testmail = /^\S+@\S+\.\S+$/;
            var testlogin = /^[A-Za-z]+$/
            var testname = /^[A-Z][a-z]+ [A-Z][a-z]+$/;
            //samename
            
            if( testmail.test(email) && testlogin.test(login) && password === password1)
            {
                const json = {
                    method: 'POST',
                    mode: 'cors',
                    cache: 'default',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      email,
                      login,
                      password,
                      fullName,
                    }),
                  };
    
                let response = await fetch(new Request('http://localhost:8080/addUser'), json);
                respone_json = await response.json()
    
                if(respone_json[0].register == 0){
                    window.alert("Meno alebo email je uz pouzity");
                    console.log('not logged')
                }
                  
                if(respone_json[0].register == 1){
                    console.log('registred')
                }
                document.getElementById('register_page').remove();
            }
            else
            {
                if(!testmail.test(email))
                    window.alert('Chybne zadane udaje - Zly mail')
                if(!testlogin.test(login))
                    window.alert('Chybne zadane udaje - Zly login')
                if(password !== password1)
                    window.alert('Chybne zadane udaje - Heslo nie je to iste')
            }
               
        };}
    async function showLogin() {
        const create_json = {
            method: 'GET',
            mode: 'cors',
            cache: 'default',
            headers: {
            'Content-Type': 'application/json',
            },
        };

        let a = new Request('http://localhost:8080/ShowLogin');
        let response = await fetch(a, create_json);
        let translatedResponse = JSON_HTML(await response.json());

        let div = document.createElement('div');
        div.id = 'login_page';
        div.innerHTML = translatedResponse;
        document.body.appendChild(div);

        let help = document.getElementById('Log_button_2');
        document.getElementById('Log_button_1').disabled = true;
        help.onclick = async function () {
            let login = document.getElementById('login_user').value;
            let password = document.getElementById('passWord').value;
            
            const json = {
                method: 'POST',
                mode: 'cors',
                cache: 'default',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login,
                    password
                }),
              };
            let response = await fetch(new Request('http://localhost:8080/login'), json);

            response_json = await response.json()

            if(response_json[0].logged == 0){
                window.alert("Zle zadane meno alebo heslo alebo informacie uz boli pouzite");
                console.log('not logged')
            }
              
            if(response_json[0].logged == 1){
                console.log('logged')
                maxSpeed  = response_json[0].maxSpeed
                maxScore  = response_json[0].maxScore
                isAdmin   = response_json[0].isAdmin
                user_name = response_json[0].user_name
                user_car  = response_json[0].car
                user_id   = response_json[0].id

                if(isAdmin == 1)
                {
                    console.log("admin")
                    ShowAdmin();
                }
                document.getElementById('login_page').remove();
                //document.getElementById('login').remove();
                //document.getElementById('register').remove();
            }
        };}
    async function showCar() {
        const create_json = {
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id
            }),
        };
        
        id = user_id

        let response = await fetch(new Request('http://localhost:8080/ShowCar'), create_json);
        let translatedResponse = JSON_HTML(await response.json());

        let div = document.createElement('div');
        div.id = 'ShowCar_page';
        div.innerHTML = translatedResponse;
        document.body.appendChild(div);

        
        let help = document.getElementById('Save_car');
        help.onclick = async function () {
            
            let button = document.getElementById('car_1');
            if(button.checked == true)
                user_car = 1
            button = document.getElementById('car_2');
            if(button.checked == true)
                user_car = 2
            button = document.getElementById('car_3');
            if(button.checked == true)
                user_car = 3

            if(user_id != -1)
            {
                const json = {
                    method: 'POST',
                    mode: 'cors',
                    cache: 'default',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id,
                        user_car
                    }),
                  };
                console.log(json)
                url = 'http://localhost:8080/SaveCar'
                let response = await fetch(new Request(url), json);
            }
            
            document.getElementById('ShowCar_page').remove();
        };}
    async function ShowAdmin()
    {
        const create_json = {
            method: 'GET',
            mode: 'cors',
            cache: 'default',
            headers: {
            'Content-Type': 'application/json',
            }
        };
        let response = await fetch(new Request('http://localhost:8080/showAdmin'), create_json);

        let translatedResponse = JSON_HTML(await response.json());

        let div = document.createElement('div');
        div.id = 'Admin';
        div.innerHTML = translatedResponse;
        document.body.appendChild(div);

        let All_players = document.getElementById('All_players');
        All_players.onclick = async function () {
            show_all_players()
        };

        let Save_CSV = document.getElementById('Save_CSV');
        Save_CSV.onclick = async function () {

            const create_json = {
                method: 'GET',
                mode: 'cors',
                cache: 'default',
                headers: {
                'Content-Type': 'application/json',
                }
            };
            let response = await fetch(new Request('http://localhost:8080/getAllPlayers'), create_json);
            items = await response.json()

            const header = Object.keys(items[0]);

            const headerString = header.join(',');

            // handle null or undefined values here
            const replacer = (key, value) => value ?? '';

            const rowItems = items.map((row) =>
                header
                .map((fieldName) => JSON.stringify(row[fieldName], replacer))
                .join(',')
            );
            const csv = [headerString, ...rowItems].join('\r\n');
            var exportedFilenmae = 'players.csv' || 'export.csv';

            var link = document.createElement('a');
            var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

            var url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };

        let Load_CSV = document.getElementById('Load_CSV');
        Load_CSV.onclick = async function () {
            const create_json = {
                method: 'GET',
                mode: 'cors',
                cache: 'default',
                headers: {
                'Content-Type': 'application/json',
                }
            };
            let response = await fetch(new Request('http://localhost:8080/loadCSV'), create_json);
        };
    }
    async function show_all_players()
    {
        if (document.getElementById('players') !== null) {
            document.getElementById('players').remove();

            //var players_page = document.createElement('div');
            //document.body.appendChild(players_page);
          }
        
        const create_json = {
            method: 'GET',
            mode: 'cors',
            cache: 'default',
            headers: {
            'Content-Type': 'application/json',
            }
        };
        let response = await fetch(new Request('http://localhost:8080/getAllPlayers'), create_json);
        response_json = await response.json()

        create_user_table(response_json)        
    }
    function JSON_HTML(jsonObject) {
        var html = '';
        for (let i = 0; i < jsonObject.length; i++) {
          if (jsonObject[i].id !== undefined) {
          
      
            
            if (jsonObject[i].type == 'radio'  && jsonObject[i].check == true) {
              html += `<${jsonObject[i].tag} id=${jsonObject[i].id} type=${jsonObject[i].type} name=${jsonObject[i].text} checked=${jsonObject[i].check}>  </${jsonObject[i].tag}>`;
          
            } 
      
            else if (jsonObject[i].type == 'radio'  && jsonObject[i].check != true) {
              html += `<${jsonObject[i].tag} id=${jsonObject[i].id} type=${jsonObject[i].type} name=${jsonObject[i].text}>  </${jsonObject[i].tag}>`;
             
            } 
      
            else if (jsonObject[i].type == 'password') {
              html += `<${jsonObject[i].tag} id=${jsonObject[i].id} type=${jsonObject[i].type}> ${jsonObject[i].text} </${jsonObject[i].tag}>`;
            } 
            
            
            else {
              html += `<${jsonObject[i].tag} id=${jsonObject[i].id}> ${jsonObject[i].text} </${jsonObject[i].tag}>`;
            }
          } 
          
          else {
            html += `<${jsonObject[i].tag}> ${jsonObject[i].text} </${jsonObject[i].tag}>`;
          }
        }
        return html;
      }
    async function show_all_games()
    {

        const create_json = {
            method: 'GET',
            mode: 'cors',
            cache: 'default',
            headers: {
            'Content-Type': 'application/json',
            }
        };
        let response = await fetch(new Request('http://localhost:8080/getAllGames'), create_json);
        response_json = await response.json()

        create_games_table(response_json)        
    }
    async function DeleteUser(id)
    {
        const create_json = {
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id
            }),
        };
        url = 'http://localhost:8080/delete';
        let response = await fetch(new Request(url), create_json);
    }
    function create_games_table(response_json)
    {
        var games = document.createElement('div')
        games.id = 'games'

        response_json.forEach(element => {

            var game = document.createElement('table')
            game.id = 'player'
            game.style.width = 1000;

            let newRow = game.insertRow(-1);

            let newCell = newRow.insertCell(0);
            newCell.style.border = "1px solid #000"
            let newText = document.createTextNode('Game id\t');
            newCell.appendChild(newText);

            newCell = newRow.insertCell(1);
            newCell.style.border = "1px solid #000"
            newText = document.createTextNode('Player UserName\t');
            newCell.appendChild(newText);

            newCell = newRow.insertCell(2);
            newCell.style.border = "1px solid #000"
            newText = document.createTextNode('Game Score\t');
            newCell.appendChild(newText);

            newCell = newRow.insertCell(3);
            newCell.style.border = "1px solid #000"
            newText = document.createTextNode('Game Speed\t');
            newCell.appendChild(newText);

            newRow = game.insertRow(-1);

            newCell = newRow.insertCell(0);
            newCell.style.border = "1px solid #000"
            newText = document.createTextNode(element.id);
            newCell.appendChild(newText);

            newCell = newRow.insertCell(1);
            newCell.style.border = "1px solid #000"
            newText = document.createTextNode(element.user_name );
            newCell.appendChild(newText);

            newCell = newRow.insertCell(2);
            newCell.style.border = "1px solid #000"
            newText = document.createTextNode(element.score);
            newCell.appendChild(newText);

            newCell = newRow.insertCell(3);
            newCell.style.border = "1px solid #000"
            newText = document.createTextNode(element.speed);
            newCell.appendChild(newText);

            var div = document.createElement('button');
            div.textContent = 'Watch' ;
            div.id = 'button';
            div.onclick = async function () {
                Watch_game(element.id)                
            }
            game.appendChild(div);
            games.appendChild(game)
        });
        games_page.appendChild(games);
    }
    function create_user_table(response_json)
    {
        var players = document.createElement('div')
        players.id = 'players'

        response_json.forEach(element => {

            var player = document.createElement('table')
            player.id = 'player'
            player.style.width = 1000;

            let newRow = player.insertRow(-1);

            let newCell = newRow.insertCell(0);
            newCell.style.border = "1px solid #000"
            let newText = document.createTextNode('Player id\t');
            newCell.appendChild(newText);

            newCell = newRow.insertCell(1);
            newCell.style.border = "1px solid #000"
            newText = document.createTextNode('Player UserName\t');
            newCell.appendChild(newText);

            newCell = newRow.insertCell(2);
            newCell.style.border = "1px solid #000"
            newText = document.createTextNode('Player maxScore\t');
            newCell.appendChild(newText);

            newCell = newRow.insertCell(3);
            newCell.style.border = "1px solid #000"
            newText = document.createTextNode('Player max Speed\t');
            newCell.appendChild(newText);

            newRow = player.insertRow(-1);

            newCell = newRow.insertCell(0);
            newCell.style.border = "1px solid #000"
            newText = document.createTextNode(element.id);
            newCell.appendChild(newText);

            newCell = newRow.insertCell(1);
            newCell.style.border = "1px solid #000"
            newText = document.createTextNode(element.login );
            newCell.appendChild(newText);

            newCell = newRow.insertCell(2);
            newCell.style.border = "1px solid #000"
            newText = document.createTextNode(element.maxScore);
            newCell.appendChild(newText);

            newCell = newRow.insertCell(3);
            newCell.style.border = "1px solid #000"
            newText = document.createTextNode(element.maxSpeed);
            newCell.appendChild(newText);

            var div = document.createElement('button');
            div.textContent = 'Delete' ;
            div.id = 'button';
            div.onclick = async function () {
                DeleteUser(element.id)
                show_all_players()
            }
            player.appendChild(div);
            players.appendChild(player)
        });
        players_page.appendChild(players);
    }