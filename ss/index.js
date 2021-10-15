
const express = require('express');
const server = express();
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('/home/sgaglani/ssp/biggusdatus/model/test.db',err =>
{
if(err)
{
    console.log("ERROR");
}
console.log("CONNECTION ESTABLISHED");
});


server.set('view-engine', 'ejs');
server.use(express.urlencoded({extended: false}));
server.use(express.json());

server.get('/', (req, res)=>{
    res.render('home.ejs');
});
server.get('/about', (req, res)=> {
    res.render('about.ejs');
});
server.get('/register', (req, res)=>{
    res.render('register.ejs');
});

server.get('/login', (req, res)=>{
    res.render('login.ejs');
});


server.post('/login', async (req,res)=>{
    try
    {
        query = `select * from login where email=="${req.body.email}" and password=="${req.body.password}";`

        db.get(query,(err, result) => {
            if(err)
            {
                throw err;
            }
            console.log(result)
            if (result) 
            {
                console.log("login successful");
                res.render("welcome.ejs");
            }
            else
            {
                console.log("login failed");
                res.redirect("/login");
            }

        });
    
    }
    catch
    {
        res.redirect('/');
    }
    
});


server.post('/register', async (req, res) => {

    try
    {
        registerUser(req.body.firstname, req.body.lastname, req.body.email, req.body.password);
    }
    catch
    {
        res.redirect('/');
    }
    finally {
        res.redirect('/')
    }
});

function registerUser(firstname, lastname, email, password)
{
    var query = `INSERT INTO login (firstname, lastname, email, password) VALUES ("${firstname}", "${lastname}", "${email}", "${password}");`;
    db.run(query,(err) =>{
        if(err)
        {
            throw err;
        }
        else
        {
        console.log(`**Last ID: ${this.lastID}**`);
        }
    });
}

server.get('/adminlogin', (req, res) => {
    res.render("adminlogin.ejs");
});

server.post('/adminlogin', (req, res) =>{
    try
    {
        query = `select * from adminlogin where username = "${req.body.username}" and password = "${req.body.password}";`
        console.log(query);
        db.get(query,(err, result) => {
            if(err)
            {
                throw err;
            }
            console.log(result)
            if (result) 
            {
                console.log("login successful");
                res.render("welcomeadmin.ejs");
            }
            else
            {
                console.log("login failed");
                res.redirect("/adminlogin");
            }

        });
    
    }
    catch
    {
        res.redirect('/');
    }

});


server.get("/addUser", (req, res)=>{
    res.render('addUser.ejs')

});

server.get('/removeUser', (req, res) =>{
    res.render('removeUser.ejs');
});

server.post('/removeUser', (req, res) =>{
    try
    {
        findUser(req.body.email);
    }
    catch
    {
        res.redirect('/');
    }
    finally
    {
        res.redirect('/');
    }

});

function findUser(email)
{
    var query = `select * from login where email = "${email}"`;
    db.get(query,(err, result) => {
        if(err)
        {
            throw err;
        }
        console.log(result)
        if (result) 
        {
            query = `DELETE from login where email = "${result.email}";`;
            db.run(query);
        
        }
        else
        {
            console.log("User not found try again");
            res.redirect("/removeUser");
        }

    });
    

}


   




server.listen(3000, ()=>
{
    console.log("****SERVER RUNNING****");
});
