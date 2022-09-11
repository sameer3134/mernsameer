const express = require('express');
const app = express();
const notes= require('./data/notes');
const dotenv = require("dotenv");
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');
const path = require('path')
const { notFound, errorHandler } = require('./middleware/ErrorMiddleware');
dotenv.config();
app.use(express.json());

connectDB();



app.use('/api/users', userRoutes)
app.use('/api/notes', noteRoutes)

//   --deployment----

__dirname=path.resolve()
if(process.env.NODE_ENV=== 'production'){
   app.use(express.static(path.join(__dirname, '/frontend/build')))


   app.get('*',(req,res)=>{
       res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
   })
}else{
    app.get('/',(req,res)=>{
        res.send("main");
    });
}

app.use(notFound);
app.use(errorHandler)
app.listen(process.env.PORT,console.log("port 5000"))