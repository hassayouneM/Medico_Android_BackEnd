const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

//enable the cors
app.use(cors());
app.options('*', cors());

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));

require('dotenv/config');

//Routes
const usersRoutes = require('./routes/users');
const medicationsRoutes = require('./routes/medications');
const patientsRoutes = require('./routes/patients');
const assistantsRoutes = require('./routes/assistants');
const healthsRoutes = require('./routes/healths');

const api = process.env.API_URL;

app.get(`${api}`,(req, res) => {
    res.send('HELLO');
})

app.use(`${api}/users`, usersRoutes);
app.use(`${api}/medications`, medicationsRoutes);
app.use(`${api}/patients`, patientsRoutes);
app.use(`${api}/assistants`, assistantsRoutes);
app.use(`${api}/healths`, healthsRoutes);


//Connecting DataBase
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'medico-DB',
    
})
.then(()=> {
    console.log('DATABASE CONNECTED')
})
.catch((err) => {
    console.log(err)
})

//Connecting server
app.listen(3000, ()=>{
    console.log('server is running on port 3000');
})