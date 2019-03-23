const express = require('express'),
app = express(),
httpApp = express(),
session = require('express-session'),
userModel = require('./models/index'),
bodyParser =require('body-parser'),
http = require('http'),
https = require('https'),
fs = require('fs');

const httpServer = http.createServer(httpApp);
const httpsServer = https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: 'anhtuan'
}, app);

const io = require('socket.io')(httpsServer);
require('./socket')(io);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const sessionMiddleWare = session({
    secret: 'abcxuz',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge:1000*60*60*24*30 } //session song 30 ngay
})
io.use((socket,next)=>{
    sessionMiddleWare(socket.request, socket.request.res, next)
});

httpApp.get("*", (req, res) => {
    res.redirect("https://" + req.headers.host + req.path);
});

app.use(sessionMiddleWare);
app.use(express.static("public"));
app.set("view engine","ejs"); 
app.set("views","./views"); 

app.route('/login')
.get(isLogin,(req,res)=> res.render('index'))
.post((req,res)=>{
    userModel.signin(req.body.username,req.body.password)
    .then(()=>{
        req.session.user = req.body.username;
        res.redirect('/')
    },err=> res.render('login',{err:err}));
});
app.route('/signup')
.get((req,res)=> res.render('signup',{err:''}))
.post((req,res)=>{
    userModel.signup(req.body.username,req.body.password)
    .then(()=>{
        req.session.user = req.body.username;
        res.redirect('/');
    },()=>res.render('signup',{err:'username is already exist'}))
})
app.get('/logout',(req,res)=> {
    req.session.destroy();
    res.redirect("/");
})
app.get('*',isLogin,(req,res)=> res.render('index'));

function isLogin(req,res,next){
    if(req.session.user) return next();
    res.render('login',{err:''});
}


httpServer.listen(process.env.PORT || 80);
httpsServer.listen(process.env.PORT || 443);

//openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365