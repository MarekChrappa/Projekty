//import Chart from 'chart.js/auto';

var logged = false
var id = -1
var admin = false
var methods
var values = ["Vaha", "Pulse", "Steps"]; //lol
Home_Page()

async function add(page)
{

  if(document.getElementById('Reklama') !== null)
    document.getElementById('Reklama').remove();

  const json = {
    method: 'GET',
    mode: 'cors',
    cache: 'default',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let response = await fetch(new Request('http://localhost:8080/Return_Add'), json);
  var response_json = await response.json()
  var adds = response_json.adds

  var a = Math.floor(Math.random() * adds.length);
  var add = adds[a];

  var addimg = new Image();
  addimg.onload = function(){
    addimg.src = this.src;   
  };
  addimg.onclick = async function(){
    console.log(add.url)
    window.open(add.url)

    add.counter++

    const json = {
      method: 'PUT',
      mode: 'cors',
      cache: 'default',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: add.id,
        counter: add.counter
      }),
    };

    let response = await fetch(new Request('http://localhost:8080/Update_Add'), json);
    var response_json = await response.json()

    console.log('updated')

  }
  addimg.src = add.src;

  var div = document.createElement('div');
  div.id = 'Reklama'
  
  div.appendChild(addimg);
  page.appendChild(div);
  
}

function add_manager(page){
  add(page)
  setInterval(add, 60000, page);
}

async function Home_Page()
{
    var home_page = document.createElement('div');
    home_page.id = 'Home_Page'
    document.body.appendChild(home_page);

    var btn = document.createElement('button');
    btn.textContent = 'Login' ;
    btn.id = 'button';
    btn.onclick = async function () {
        Login_Page()                     
    }
    home_page.appendChild(btn);

    var btn = document.createElement('button');
    btn.textContent = 'Register' ;
    btn.id = 'button';
    btn.onclick = async function () {
      Register_Page()     
    }
    home_page.appendChild(btn);

    add_manager(home_page)
    
}
async function Login_Page()
{
    if (document.getElementById('Home_Page') !== null)
      document.getElementById('Home_Page').remove();

    var login_page = document.createElement('div');
    login_page.id = 'login_page'
    document.body.appendChild(login_page);

    var text = document.createElement('label')
    text.innerHTML = 'Name'
    login_page.append(text)

    var input = document.createElement('input')
    input.id = 'Name'
    input.type = 'text'
    login_page.appendChild(input)



    var text = document.createElement('label')
    text.innerHTML = 'Password'
    login_page.append(text)

    var input = document.createElement('input')
    input.id = 'Password'
    input.type = 'password'
    login_page.appendChild(input)

    var btn = document.createElement('button');
    btn.textContent = 'Login' ;
    btn.id = 'button';
    btn.onclick = async function () {

        let login = document.getElementById('Name').value;
        let password = document.getElementById('Password').value;

        const json = {
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              login,
              password,
            }),
          };

        let response = await fetch(new Request('http://localhost:8080/login'), json);
        var response_json = await response.json()

        console.log(response_json)

        if(response_json.status != 'logged'){
            window.alert("Zle zadane meno alebo heslo alebo informacie uz boli pouzite");
            console.log('not logged')
        }
        if(response_json.status == 'logged'){
            window.alert('Logged')
            id = response_json.UID
            admin = response_json.admin
            document.getElementById('login_page').remove();
            Client_Page()
        }
    }
    login_page.appendChild(btn);
    add_manager(login_page)
}
async function Register_Page()
{
    document.getElementById('Home_Page').remove();

    var register_page = document.createElement('div');
    register_page.id = 'register_page'
    document.body.appendChild(register_page);


    var Text = document.createElement('label')
    Text.innerHTML = 'Name'
    register_page.append(Text)

    var input = document.createElement('input')
    input.id = 'Name'
    input.type = 'text'
    register_page.appendChild(input)

    var text = document.createElement('label')
    text.innerHTML = 'Email'
    register_page.append(text)

    var input = document.createElement('input')
    input.id = 'Email'
    input.type = 'text'
    register_page.appendChild(input)

    var text = document.createElement('label')
    text.innerHTML = 'Password'
    register_page.append(text)

    var input = document.createElement('input')
    input.id = 'Password'
    input.type = 'password'
    register_page.appendChild(input)


    var text = document.createElement('label')
    text.innerHTML = 'Age'
    register_page.append(text)

    var input = document.createElement('input')
    input.id = 'Age'
    input.type = 'number'
    register_page.appendChild(input)


    var text = document.createElement('label')
    text.innerHTML = 'Height'
    register_page.append(text)

    var input = document.createElement('input')
    input.id = 'Height'
    input.type = 'number'
    register_page.appendChild(input) 

    var btn = document.createElement('button');
    btn.textContent = 'Register' ;
    btn.id = 'button';
    btn.onclick = async function () {

        let login = document.getElementById('Name').value;
        let password = document.getElementById('Password').value;
        let email = document.getElementById('Email').value;
        let age = document.getElementById('Age').value;
        let height = document.getElementById('Height').value;

        var testmail = /^\S+@\S+\.\S+$/;

        console.log(login)
        if( testmail.test(email))
        {
          console.log('here')
          const json = {
              method: 'POST',
              mode: 'cors',
              cache: 'default',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                login,
                password,
                email,
                age,
                height
              }),
            };

          let response = await fetch(new Request('http://localhost:8080/register'), json);
          var response_json = await response.json()

          if(response_json.status == 'error'){
              window.alert("Zle zadane meno alebo heslo alebo informacie uz boli pouzite");
              console.log('not logged')
          }
          else
          {
            window.alert('Register completeed log to continue')
            document.getElementById('register_page').remove();
            Login_Page()
          }  
        }
        else
        {
          window.alert("email v zlej forme"); 
        }   
    }
    register_page.appendChild(btn);
    add_manager(register_page)
}
async function Client_Page()
{


  var client_page = document.createElement('div');
  client_page.id = 'client_page'
  document.body.appendChild(client_page);

  var response = await Return_measurement(0,id)
  create_all_measurement_table(response,client_page, 'Weight',0,true)

  var response = await Return_measurement(1,id)
  create_all_measurement_table(response,client_page, 'Pulse',1,true)

  var response = await Return_measurement(2,id)
  create_all_measurement_table(response,client_page, 'Steps',2,true)

  methods = await Get_methods()
  console.log(methods)

  var text = document.createElement('label')
  text.innerHTML = 'Typ'
  client_page.append(text)

  var add = document.createElement('div');
  add.id = 'ADD'
  client_page.appendChild(add);

  var input2 = document.createElement('select')
  input2.id = 'select'
  for (var x in values) {
    input2.options[input2.options.length] = new Option(values[x]);
  }
  add.appendChild(input2)

  var input3 = document.createElement('select')
  input3.id = 'metod'
  for (var x in methods) {
    input3.options[input3.options.length] = new Option(methods[x].name);
  }
  input3.options[input3.options.length] = new Option('undefined')
  add.appendChild(input3)

  var text = document.createElement('label')
  text.innerHTML = 'Value'
  add.append(text)

  var input = document.createElement('input')
  input.id = 'Value'
  input.type = 'number'
  add.appendChild(input)

  var text = document.createElement('label')
  text.innerHTML = 'DateTime'
  add.append(text)

  var input = document.createElement('input')
  input.id = 'DateTime'
  input.type = 'datetime-local'
  add.appendChild(input)

  var btn2 = document.createElement('button');
  btn2.textContent = 'Add' ;
  btn2.id = 'button';
  btn2.onclick = async function () 
  {  
    Add_value()
    document.getElementById('client_page').remove();
    Client_Page()
  }
  add.appendChild(btn2);

  var btn0 = document.createElement('button');
  btn0.textContent = 'Activities' ;
  btn0.id = 'button';
  btn0.onclick = async function () 
  {  
    document.getElementById('client_page').remove();
    Methods_Page()
  }
  client_page.appendChild(btn0);

  var btn1 = document.createElement('button');
  btn1.textContent = 'Grafs' ;
  btn1.id = 'button';
  btn1.onclick = async function () 
  {  
    document.getElementById('client_page').remove();
    Graphs_Page()
  }
  client_page.appendChild(btn1);

  var btn2 = document.createElement('button');
  btn2.textContent = 'Import' ;
  btn2.id = 'button';
  btn2.onclick = async function () 
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
    let response = await fetch(new Request('http://localhost:8080/loadCSV'), create_json);
    document.getElementById('client_page').remove();
    Client_Page()
  }
  client_page.appendChild(btn2);

  var btn3 = document.createElement('button');
  btn3.textContent = 'Export' ;
  btn3.id = 'button';
  btn3.onclick = async function () 
  {  
    var item0 = await Return_measurement(0,id)
    var item1 = await Return_measurement(1,id)
    var item2 = await Return_measurement(2,id)

    item0 = item0.concat(item1)
    var items = item0.concat(item2)

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
    var exportedFilenmae = 'measurement.csv' || 'export.csv';

    var link = document.createElement('a');
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    var url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', exportedFilenmae);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  client_page.appendChild(btn3);

  if(admin)
  {
    var btn3 = document.createElement('button');
    btn3.textContent = 'Admin Site' ;
    btn3.id = 'button';
    btn3.onclick = async function () 
    {  
      document.getElementById('client_page').remove();
      Admin_Page()
    }
    client_page.appendChild(btn3);
  }

  add_manager(client_page)
}
async function Methods_Page()
{
  var methods_page = document.createElement('div');
  methods_page.id = 'methods_page'
  document.body.appendChild(methods_page);

  var methods = await Get_methods()
  create_activities_measurement_table(methods,methods_page)



  var add = document.createElement('div');
  add.id = 'ADD'
  methods_page.appendChild(add);

  var text = document.createElement('label')
  text.innerHTML = 'Typ'
  methods_page.append(text)

  var input = document.createElement('input')
  input.id = 'Name'
  input.type = 'text'
  methods_page.appendChild(input)

  var text = document.createElement('label')
  text.innerHTML = 'Description'
  methods_page.append(text)

  var input = document.createElement('input')
  input.id = 'Description'
  input.type = 'text'
  methods_page.appendChild(input)

  var btn = document.createElement('button');
  btn.textContent = 'Add' ;
  btn.id = 'button_save';
  btn.onclick = async function () {

    let name = document.getElementById('Name').value;
    let description = document.getElementById('Description').value;

    const json = {
        method: 'POST',
        mode: 'cors',
        cache: 'default',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description
        }),
      };

    let response = await fetch(new Request('http://localhost:8080/Add_value_M'), json);
    var response_json = await response.json()


    document.getElementById('methods_page').remove();
    Methods_Page()
  }
  methods_page.append(btn)


  var btn = document.createElement('button');
  btn.textContent = 'Back' ;
  btn.id = 'button';
  btn.onclick = function () {
    document.getElementById('methods_page').remove();
    Client_Page()
  }
  methods_page.append(btn)
  add_manager(methods_page)
}

async function Admin_Page()
{
  var admin_page = document.createElement('div');
  admin_page.id = 'admin_page'
  document.body.appendChild(admin_page);
  
  const json = {
    method: 'GET',
    mode: 'cors',
    cache: 'default',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let response = await fetch(new Request('http://localhost:8080/pouzivatelia'), json);
  var response_json = await response.json()
  create_user_table(response_json.pouzivatelia,admin_page )

  var input = document.createElement('input')
  input.id = 'Name'
  input.type = 'text'
  admin_page.appendChild(input)

  var text = document.createElement('label')
  text.innerHTML = 'Email'
  admin_page.append(text)

  var input = document.createElement('input')
  input.id = 'Email'
  input.type = 'text'
  admin_page.appendChild(input)

  var text = document.createElement('label')
  text.innerHTML = 'Password'
  admin_page.append(text)

  var input = document.createElement('input')
  input.id = 'Password'
  input.type = 'password'
  admin_page.appendChild(input)


  var text = document.createElement('label')
  text.innerHTML = 'Age'
  admin_page.append(text)

  var input = document.createElement('input')
  input.id = 'Age'
  input.type = 'number'
  admin_page.appendChild(input)


  var text = document.createElement('label')
  text.innerHTML = 'Height'
  admin_page.append(text)

  var input = document.createElement('input')
  input.id = 'Height'
  input.type = 'number'
  admin_page.appendChild(input) 

  var btn = document.createElement('button');
  btn.textContent = 'Register' ;
  btn.id = 'button';
  btn.onclick = async function () {

    let login = document.getElementById('Name').value;
    let password = document.getElementById('Password').value;
    let email = document.getElementById('Email').value;
    let age = document.getElementById('Age').value;
    let height = document.getElementById('Height').value;

    console.log(login)

    const json = {
        method: 'POST',
        mode: 'cors',
        cache: 'default',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login,
          password,
          email,
          age,
          height
        }),
      };

    let response = await fetch(new Request('http://localhost:8080/register'), json);
    var response_json = await response.json()

    if(response_json.status == 'error'){
        window.alert("Zle zadane meno alebo heslo alebo informacie uz boli pouzite");
        console.log('not logged')
    }
    else
    {
      document.getElementById('admin_page').remove();
      Admin_Page()
    }      
  }
  admin_page.appendChild(btn) 

  var btn2 = document.createElement('button');
  btn2.textContent = 'Import' ;
  btn2.id = 'button';
  btn2.onclick = async function () 
  {  
    const create_json = {
      method: 'GET',
      mode: 'cors',
      cache: 'default',
      headers: {
      'Content-Type': 'application/json',
      },
    };
    let response = await fetch(new Request('http://localhost:8080/loadCSV_Users'), create_json);
    document.getElementById('admin_page').remove();
    Admin_Page()
  }
  admin_page.appendChild(btn2);

  var btn3 = document.createElement('button');
  btn3.textContent = 'Export' ;
  btn3.id = 'button';
  btn3.onclick = async function () 
  {  
    const create_json = {
      method: 'GET',
      mode: 'cors',
      cache: 'default',
      headers: {
      'Content-Type': 'application/json',
      }
    };
    let response = await fetch(new Request('http://localhost:8080/pouzivatelia'), create_json);
    //document.getElementById('client_page').remove();
    //Client_Page()
    var response_json = await response.json()
    var items = response_json.pouzivatelia

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
    var exportedFilenmae = 'users.csv' || 'export.csv';

    var link = document.createElement('a');
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    var url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', exportedFilenmae);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  admin_page.appendChild(btn3);

  var btn = document.createElement('button');
  btn.textContent = 'Add manager' ;
  btn.id = 'button';
  btn.onclick = async function () {
    document.getElementById('admin_page').remove();
    Add_Page()
  }
  admin_page.appendChild(btn) 


  var btn = document.createElement('button');
  btn.textContent = 'Back' ;
  btn.id = 'button';
  btn.onclick = async function () {
    document.getElementById('admin_page').remove();
    Client_Page()
  }
  admin_page.appendChild(btn) 


  

}

async function Add_Page()
{
  var add_page = document.createElement('div');
  add_page.id = 'add_page'
  document.body.appendChild(add_page);

  if(document.getElementById('Reklama') !== null)
    document.getElementById('Reklama').remove();

  const json = {
    method: 'GET',
    mode: 'cors',
    cache: 'default',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let response = await fetch(new Request('http://localhost:8080/Return_Add'), json);
  var response_json = await response.json()
  var adds = response_json.adds

  create_adds_table(adds,add_page)

  var text = document.createElement('label')
  text.innerHTML = 'URL'
  add_page.append(text)

  var input = document.createElement('input')
  input.id = 'URL'
  input.type = 'text'
  add_page.appendChild(input)


  var text = document.createElement('label')
  text.innerHTML = 'SRC'
  add_page.append(text)

  var input = document.createElement('input')
  input.id = 'SRC'
  input.type = 'text'
  add_page.appendChild(input)

  var btn = document.createElement('button');
  btn.textContent = 'Add add' ;
  btn.id = 'button';
  btn.onclick = async function () {
    let url = document.getElementById('URL').value;
    let src = document.getElementById('SRC').value;

    const json = {
      method: 'POST',
      mode: 'cors',
      cache: 'default',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        src
      }),
    };

    let response = await fetch(new Request('http://localhost:8080/Add_Add'), json);
    var response_json = await response.json()

    document.getElementById('add_page').remove();
    Add_Page()                     
  }
  add_page.appendChild(btn);
}

async function Add_value()
{
    let value = document.getElementById('Value').value;
    let DateTime = document.getElementById('DateTime').value;
    let type = document.getElementById('select').value;
    let method_id = document.getElementById('metod').value;

    if (value.length == 0){
      window.alert("Hodnota nebola zadana");
      return
    }
    if (DateTime.length == 0){
      window.alert("Datum je zly");
      return
    }
      
    
    if(method_id  == 'undefined')
      method_id  = null
    else{
      for (var x in methods) {
        if (method_id  == methods[x].name){
          method_id  = methods[x].id
          break
        }
      }
    }

    for (var x in values) {
      if (type == values[x]){
        type = x
        break
      }
    }

    const json = {
      method: 'POST',
      mode: 'cors',
      cache: 'default',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        value,
        id,
        DateTime,
        method_id
      }),
    };

    let response = await fetch(new Request('http://localhost:8080/Add_value'), json);
    var response_json = await response.json()
}
async function Get_methods()
{
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

  return response_json.merania
}
async function Return_measurement(type,id)
{
  const json = {
    method: 'POST',
    mode: 'cors',
    cache: 'default',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type,
      id
    }),
  };

  let response = await fetch(new Request('http://localhost:8080/measurement'), json);
  var response_json = await response.json()
  console.log(response_json.merania)
  return(response_json.merania)
}

function select(response,method,date_from,date_to)
{
  if(date_from == -1)
  {
    var datetime = false
  }
  else
    var datetime = true

  for (var x in methods) {
    if (method  == methods[x].name){
      method  = methods[x].id
      break
    }
  }

  var result = []
  var i = 0;

  console.log(datetime)


  for (var k in response) 
  {
    var msend = false;
    var dsend = false;

    if(method != -1)
    {
      if(response[k].mid == method){
        msend = true
      }
    }
    else
    {
      msend = true
    }

    if(datetime == true)
    {
      var helpd = new Date(response[k].datetime)
      //console.log(helpd)
      //console.log(date_from)
      //console.log((date_to))
      if(helpd > date_from && helpd < date_to)
      {
        dsend = true;
      }
    }
    else
    {
      dsend = true
    }

    console.log(dsend)
    console.log(msend)

    if(dsend == true && msend == true)
      result[i++] = response[k]
  }
  console.log(result)
  return result
}

async function Graphs_Page()
{

  

  var graphs_page = document.createElement('div');
  graphs_page.id = 'graphs_page'
  document.body.appendChild(graphs_page);

  var add = document.createElement('div');
  add.id = 'ADD'
  graphs_page.appendChild(add);


  methods = await Get_methods()

  var input3 = document.createElement('select')
  input3.id = 'metod'
  for (var x in methods) {
    input3.options[input3.options.length] = new Option(methods[x].name);
  }
  input3.options[input3.options.length] = new Option('undefined')
  add.appendChild(input3)

  var text = document.createElement('label')
  text.innerHTML = 'DateTime From'
  add.append(text)

  var input = document.createElement('input')
  input.id = 'DateTime_from'
  input.type = 'datetime-local'
  add.appendChild(input)

  var text = document.createElement('label')
  text.innerHTML = 'DateTime to'
  add.append(text)

  var input = document.createElement('input')
  input.id = 'DateTime_to'
  input.type = 'datetime-local'
  add.appendChild(input)

  var btn3 = document.createElement('button');
  btn3.textContent = 'Generate' ;
  btn3.id = 'G_button';
  btn3.onclick = async function () { 

    let method_id = document.getElementById('metod').value;
    let DateTime_from = document.getElementById('DateTime_from').value;
    let DateTime_to = document.getElementById('DateTime_to').value;


    
    if (DateTime_from.length == 0 && DateTime_to.length == 0  ){
      window.alert("Datum je zly");
      DateTime_from = -1;
      DateTime_to = -1
    } 
    else
    {
      DateTime_from = new Date(DateTime_from)
      DateTime_to = new Date(DateTime_to)
    }

    if(method_id == 'undefined'){
      method_id = -1 
    }

    var response = await Return_measurement(0,id)
    response = select(response,method_id, DateTime_from, DateTime_to)
    if(response.length > 0)
    {
      create_all_measurement_table(response,graphs_page, 'Weight',0,false)
      generate_graph('Weight',response,graphs_page)
    }
    

    var response = await Return_measurement(1,id)
    response = select(response,method_id, DateTime_from, DateTime_to)
    if(response.length > 0)
    {
      create_all_measurement_table(response,graphs_page, 'Pulse',1,false)
      generate_graph('Pulse',response,graphs_page)
    }

    var response = await Return_measurement(2,id)
    response = select(response,method_id, DateTime_from, DateTime_to)
    if(response.length > 0)
    {
      create_all_measurement_table(response,graphs_page, 'Steps',2,false)
      generate_graph('Steps',response,graphs_page)
    }

    var btn = document.createElement('button');
    btn.textContent = 'Back' ;
    btn.id = 'button';
    btn.onclick = function () {
      document.getElementById('graphs_page').remove();
      Client_Page()
    }
    graphs_page.append(btn)

  }
  add.appendChild(btn3)

  

  add_manager(graphs_page)

}

function generate_graph(name,response,page)
{

  var canv = document.createElement('canvas');
  canv.id = name;
  page.appendChild(canv); 

  var a = []
  var date = []
  var b = []

  var yyy = new Date(response[0].datetime)
  for(var v in response)
  {
    date[v] = new Date(response[v].datetime)
    a[v] = response[v].datetime

    var Difference_In_Time = date[v].getTime() - yyy.getTime();
    b[v] = Difference_In_Time / (1000 * 3600 * 24);
  }

  var result = [], i = -1;
  var reg_result = []
  while ( response[++i] ) { 
    result.push( [ a[i], response[i].value,  ] );
    reg_result.push( [ b[i], response[i].value,  ] );
  } 

  var values = []
  for(var k in response)
  {
    values[k] = response[k].value
  }

  
  console.log(reg_result)
  const my_regression = regression.linear( reg_result);
  console.log(my_regression)

  const useful_points = my_regression.points.map(([x,y]) => {
    return y;    
  })

  console.log(useful_points)


  var result2 = []
  i = -1;
  while ( response[++i] ) { 
    //a = new Date(response[i].datetime);
    result2.push( [ a[i], useful_points[i],  ] );
  
  } 

  var ctx = document.getElementById(name);
  new Chart(ctx, {
    type: "scatter",
    data: {
      
      datasets: [{
        pointRadius: 4,
        label: name,
        pointBackgroundColor: "rgba(0,0,255,1)",
        data: result
      },{
        type: 'line',
        label: 'Linear regresion',
        labels: a,
        data: result2,
    }]
    
    },
    options: {
      responsive: true,
      scales: {
        x:{
          type: 'time'
        }
      }
    }
  });
}


function create_all_measurement_table(response_json,games_page,H3,type,client)
{
    var Text = document.createElement('label')
    Text.innerHTML = H3
    games_page.append(Text)
    
    var games = document.createElement('div')
    games.id = 'games'

    var game = document.createElement('table')
    game.id = 'player'
    game.style.width = 1000;

    let newRow = game.insertRow(-1);

    let newCell = newRow.insertCell(0);
    newCell.style.border = "1px solid #000"
    let newText = document.createTextNode('ID\t');
    newCell.appendChild(newText);

    newCell = newRow.insertCell(1);
    newCell.style.border = "1px solid #000"
    newText = document.createTextNode('Value\t');
    newCell.appendChild(newText);

    newCell = newRow.insertCell(2);
    newCell.style.border = "1px solid #000"
    newText = document.createTextNode('activity\t');
    newCell.appendChild(newText);

    newCell = newRow.insertCell(3);
    newCell.style.border = "1px solid #000"
    newText = document.createTextNode('DateTime\t');
    newCell.appendChild(newText);

    if(client == true)
    { 
      newCell = newRow.insertCell(4);
      newCell.style.border = "1px solid #000"
      newText = document.createTextNode('Delete\t');
      newCell.appendChild(newText);
    }
    

    response_json.forEach(element => {

        newRow = game.insertRow(-1);

        newCell = newRow.insertCell(0);
        newCell.style.border = "1px solid #000"
        newText = document.createTextNode(element.id);
        newCell.appendChild(newText);

        newCell = newRow.insertCell(1);
        newCell.style.border = "1px solid #000"
        newText = document.createTextNode(element.value );
        newCell.appendChild(newText);

        newCell = newRow.insertCell(2);
        newCell.style.border = "1px solid #000"
        newText = document.createTextNode(element.activity);
        newCell.appendChild(newText);

        newCell = newRow.insertCell(3);
        newCell.style.border = "1px solid #000"
        newText = document.createTextNode(element.datetime);
        newCell.appendChild(newText);

        newCell = newRow.insertCell(4);
        newCell.style.border = "1px solid #000"
        var div = document.createElement('button');
        div.textContent = 'Delete' ;
        div.id = 'button';

        if(client == true)
        {
          div.onclick = async function () {

            const json = {
              method: 'POST',
              mode: 'cors',
              cache: 'default',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                type,
                id: element.id
              }),
            };
          
            let response = await fetch(new Request('http://localhost:8080/Delete_value'), json);
            var response_json = await response.json() 
  
            document.getElementById('client_page').remove();
            Client_Page()
          }
          newCell.appendChild(div);
        }
        
        games.appendChild(game)
    });
    games_page.appendChild(games);
}
function create_activities_measurement_table(response_json,games_page,H3,type)
{
    var Text = document.createElement('label')
    Text.innerHTML = H3
    games_page.append(Text)
    
    var games = document.createElement('div')
    games.id = 'games'

    var game = document.createElement('table')
    game.id = 'player'
    game.style.width = 1000;

    let newRow = game.insertRow(-1);

    let newCell = newRow.insertCell(0);
    newCell.style.border = "1px solid #000"
    let newText = document.createTextNode('ID\t');
    newCell.appendChild(newText);

    newCell = newRow.insertCell(1);
    newCell.style.border = "1px solid #000"
    newText = document.createTextNode('Name\t');
    newCell.appendChild(newText);

    newCell = newRow.insertCell(2);
    newCell.style.border = "1px solid #000"
    newText = document.createTextNode('Description\t');
    newCell.appendChild(newText);

    newCell = newRow.insertCell(3);
    newCell.style.border = "1px solid #000"
    newText = document.createTextNode('Delete\t');
    newCell.appendChild(newText);

    response_json.forEach(element => {

        newRow = game.insertRow(-1);

        newCell = newRow.insertCell(0);
        newCell.style.border = "1px solid #000"
        newText = document.createTextNode(element.id);
        newCell.appendChild(newText);

        newCell = newRow.insertCell(1);
        newCell.style.border = "1px solid #000"
        newText = document.createTextNode(element.name);
        newCell.appendChild(newText);

        newCell = newRow.insertCell(2);
        newCell.style.border = "1px solid #000"
        newText = document.createTextNode(element.description);
        newCell.appendChild(newText);

        newCell = newRow.insertCell(3);
        newCell.style.border = "1px solid #000"
        var div = document.createElement('button');
        div.textContent = 'Delete' ;
        div.id = 'button';
        div.onclick = async function () {
          //jeeej
          const json = {
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: element.id
            }),
          };
        
          let response = await fetch(new Request('http://localhost:8080/Delete_value_M'), json);
          var response_json = await response.json() 

          document.getElementById('methods_page').remove();
          Methods_Page()
        }
        newCell.appendChild(div);
        games.appendChild(game)
    });
    games_page.appendChild(games);
}
function create_user_table(response_json,games_page,)
{
    var Text = document.createElement('label')
    Text.innerHTML = 'Pouzivatelia:'
    games_page.append(Text)
    
    var games = document.createElement('div')
    games.id = 'games'

    var game = document.createElement('table')
    game.id = 'player'
    game.style.width = 1000;

    let newRow = game.insertRow(-1);

    let newCell = newRow.insertCell(0);
    newCell.style.border = "1px solid #000"
    let newText = document.createTextNode('ID\t');
    newCell.appendChild(newText);

    newCell = newRow.insertCell(1);
    newCell.style.border = "1px solid #000"
    newText = document.createTextNode('Name\t');
    newCell.appendChild(newText);

    newCell = newRow.insertCell(2);
    newCell.style.border = "1px solid #000"
    newText = document.createTextNode('Password\t');
    newCell.appendChild(newText);

    newCell = newRow.insertCell(3);
    newCell.style.border = "1px solid #000"
    newText = document.createTextNode('Age\t');
    newCell.appendChild(newText);

    newCell = newRow.insertCell(4);
    newCell.style.border = "1px solid #000"
    newText = document.createTextNode('Height\t');
    newCell.appendChild(newText);

    newCell = newRow.insertCell(5);
    newCell.style.border = "1px solid #000"
    newText = document.createTextNode('isAdmin\t');
    newCell.appendChild(newText);

    newCell = newRow.insertCell(6);
    newCell.style.border = "1px solid #000"
    newText = document.createTextNode('Delete\t');
    newCell.appendChild(newText);

    response_json.forEach(element => {

        newRow = game.insertRow(-1);

        newCell = newRow.insertCell(0);
        newCell.style.border = "1px solid #000"
        newText = document.createTextNode(element.id);
        newCell.appendChild(newText);

        newCell = newRow.insertCell(1);
        newCell.style.border = "1px solid #000"
        newText = document.createTextNode(element.name);
        newCell.appendChild(newText);

        newCell = newRow.insertCell(2);
        newCell.style.border = "1px solid #000"
        newText = document.createTextNode(element.password);
        newCell.appendChild(newText);

        newCell = newRow.insertCell(3);
        newCell.style.border = "1px solid #000"
        newText = document.createTextNode(element.age);
        newCell.appendChild(newText);

        newCell = newRow.insertCell(4);
        newCell.style.border = "1px solid #000"
        newText = document.createTextNode(element.height);
        newCell.appendChild(newText);

        newCell = newRow.insertCell(5);
        newCell.style.border = "1px solid #000"
        newText = document.createTextNode(element.isAdmin);
        newCell.appendChild(newText);

        newCell = newRow.insertCell(6);
        newCell.style.border = "1px solid #000"
        var div = document.createElement('button');
        div.textContent = 'Delete' ;
        div.id = 'button';
        div.onclick = async function () {
          const json = {
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: element.id
            }),
          };
        
          let response = await fetch(new Request('http://localhost:8080/Delete_user'), json);
          var response_json = await response.json() 

          document.getElementById('admin_page').remove();
          Admin_Page()
        }
        newCell.appendChild(div);
        games.appendChild(game)
    });
    games_page.appendChild(games);
}

function create_adds_table(response_json,games_page,)
{
    var Text = document.createElement('label')
    Text.innerHTML = 'Pouzivatelia:'
    games_page.append(Text)
    
    var games = document.createElement('div')
    games.id = 'games'

    var game = document.createElement('table')
    game.id = 'player'
    game.style.width = 1000;

    let newRow = game.insertRow(-1);

    let newCell = newRow.insertCell(0);
    newCell.style.border = "1px solid #000"
    let newText = document.createTextNode('ID\t');
    newCell.appendChild(newText);

    newCell = newRow.insertCell(1);
    newCell.style.border = "1px solid #000"
    newText = document.createTextNode('URL\t');
    newCell.appendChild(newText);

    newCell = newRow.insertCell(2);
    newCell.style.border = "1px solid #000"
    newText = document.createTextNode('SRC\t');
    newCell.appendChild(newText);

    newCell = newRow.insertCell(3);
    newCell.style.border = "1px solid #000"
    newText = document.createTextNode('COUNTER\t');
    newCell.appendChild(newText);

    newCell = newRow.insertCell(4);
    newCell.style.border = "1px solid #000"
    newText = document.createTextNode('EDIT\t');
    newCell.appendChild(newText);

    newCell = newRow.insertCell(5);
    newCell.style.border = "1px solid #000"
    newText = document.createTextNode('Delete\t');
    newCell.appendChild(newText);

    response_json.forEach(element => {

        newRow = game.insertRow(-1);

        newCell = newRow.insertCell(0);
        newCell.style.border = "1px solid #000"
        newText = document.createTextNode(element.id);
        newCell.appendChild(newText);

        newCell = newRow.insertCell(1);
        newCell.style.border = "1px solid #000"
        newText = document.createTextNode(element.url);
        newCell.appendChild(newText);

        newCell = newRow.insertCell(2);
        newCell.style.border = "1px solid #000"
        newText = document.createTextNode(element.src);
        newCell.appendChild(newText);

        newCell = newRow.insertCell(3);
        newCell.style.border = "1px solid #000"
        newText = document.createTextNode(element.counter);
        newCell.appendChild(newText);

        newCell = newRow.insertCell(4);
        newCell.style.border = "1px solid #000"
        var div = document.createElement('button');
        div.textContent = 'Edit' ;
        div.id = 'button';
        div.onclick = async function () {
          
          var idd = element.id
          document.getElementById('add_page').remove();

          var edit_page = document.createElement('div');
          edit_page.id = 'edit_page'
          document.body.appendChild(edit_page);

          var text = document.createElement('label')
          text.innerHTML = 'URL'
          edit_page.append(text)

          var input = document.createElement('input')
          input.id = 'URL'
          input.type = 'text'
          edit_page.appendChild(input)


          var text = document.createElement('label')
          text.innerHTML = 'SRC'
          edit_page.append(text)

          var input = document.createElement('input')
          input.id = 'SRC'
          input.type = 'text'
          edit_page.appendChild(input)

          var div = document.createElement('button');
          div.textContent = 'Edit' ;
          div.id = 'button';
          div.onclick = async function () 
          {
            let url = document.getElementById('URL').value;
            let src = document.getElementById('SRC').value;
  
            const json = {
              method: 'PUT',
              mode: 'cors',
              cache: 'default',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                url,
                src,
                id: idd
              }),
            };
  
            let response = await fetch(new Request('http://localhost:8080/Update_Add2'), json);
            var response_json = await response.json()
  
            document.getElementById('edit_page').remove();
            Add_Page()
          }
          edit_page.appendChild(div)

        }
        newCell.appendChild(div);

        newCell = newRow.insertCell(5);
        newCell.style.border = "1px solid #000"
        var div = document.createElement('button');
        div.textContent = 'Delete' ;
        div.id = 'button';
        div.onclick = async function () {
          const json = {
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: element.id
            }),
          };
        
          let response = await fetch(new Request('http://localhost:8080/Delete_Add'), json);
          var response_json = await response.json() 

          document.getElementById('add_page').remove();
          Add_Page()
        }
        newCell.appendChild(div);
        games.appendChild(game)
    });
    games_page.appendChild(games);
}

function dateIsValid(date) {
  return date instanceof Date && !isNaN(date);
}