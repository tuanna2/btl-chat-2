const express = require('express');
const app = express();
const session = require('express-session');
const userModel = require('./models/index')
const bodyParser =require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const socketIO = require('./socket');
socketIO(io);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const sessionMiddleWare = session({
    secret: 'abcxuz',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge:1000*60*60*24*30 } //cookie song 30 ngay
})
io.use((socket,next)=>{
    sessionMiddleWare(socket.request, socket.request.res, next)
})
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

http.listen(3000, ()=>{
    console.log('Server listening on port 3000');
});