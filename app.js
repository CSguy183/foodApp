const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// app.get('/', function(req, res){
//     console.log('home page been requested');
//     res.send("<h1>hello from home page</h1>")
// })

// let person={
//     name:'rahul',
//     age:'22'
// }

// getting req from server
// sending res to server
// app.get('/user', function(req, res){
//     console.log('user page been requested');
//     // res.send("<h1>hello from user page</h1>")
//     res.json(person);
// });

//giving data to server
// create

// app.post('/user', function(req,res){
//     console.log(req.body);
//     res.status(200).json(req.body);
// })

//id used to differentiate between users
// app.get('/user/:id', function(req,res){
//     console.log(req.params);
//     res.status(200).send('data received successfully');
// })

// mounting of router

const userRouter = require('./Routes/userRoutes');
const authRouter = require('./Routes/authRoutes');

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

app.listen(8080, function () {
    console.log('server has started');
})