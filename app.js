const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const {ObjectId} = require('mongodb');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

mongoose.connect(config.database);
let db = mongoose.connection;

//Revisar Conexion
db.once('open', function(){
  console.log('Conectado a MongoDB')
})


//Revisar Errores en DB
db.on('error',function(err){
  console.log(err)
})


//Init App
const app = express();


// BodyParser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


//Set Public
app.use(express.static(path.join(__dirname, 'public')))


//Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}))


//Express Message Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


//Express Validator Middleware
app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
    var namespace = param.split('.')
    , root = namespace.shift()
    , formParam = root;

    while(namespace.lenght){
      formParam += '[' + namespace.shift + ']';
    }
    return{
      param: formParam,
      msg: msg,
      value: value
    }
  }
}))


//Passport config
require('./config/passport')(passport);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


//Cargar Vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','pug');


//Cargar Models
let ModeloVehiculo = require('./models/modeloVehiculo')
let Vehiculo = require('./models/vehiculo')
let ModeloRepuesto = require('./models/modeloRepuesto')

//Inicio
app.get('/', (req, res) => {
  res.render('login')
})
/*app.get('/', (req, res) => {
  res.render('login')
  const modeloVehiculo = new ModeloVehiculo({
    _id: new mongoose.Types.ObjectId,
    tipo: "Camioneta",
    modelo: "4Runner",
    paisOrigen: "Japon",
    pVenta: 55190,
    neumaticoRepuesto: "Si",
    seguridad: 5,
    sunroof: "Si"
  });
  modeloVehiculo.save();
  const vehiculo = new Vehiculo({
    _id: new mongoose.Types.ObjectId,
    color: "rojo",
    almacen: "Lima",
    piso: 3,
    fila: 2,
    columna: 1,
    fechaEntrada: Date.now(),
    modelo: modeloVehiculo._id
  });
  vehiculo.save((err) => {
    console.log(err)
  });
})*/

app.post('/', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/inventario',
    failureRedirect: '/',
    failureFlash: true
  })(req, res, next);
})


/////// R E P U E S T O S \\\\\\\
app.get('/inventario/repuesto/', (req, res) => {
  ModeloRepuesto.find({}, (err, modelos) => {
    if(err){
      console.log(err)
    }else {
      res.render('tipo', {
        title: 'Control de Inventario',
        modelos: modelos
      })
    }
  })
})


//Router
let users = require('./routes/users')
app.use('/users', users)


//inicio Inventario
app.get('/inventario', (req, res) => {
  res.render('index')
})


/////// V E H I C U L O S \\\\\\\
//Capturar vehiculos
app.get('/inventario/vehiculo/', (req,res) => {
  ModeloVehiculo.find({}, (err, modelos) => {
    console.log(modelos)
    if(err){
      console.log(err)
    }else{
      res.render('tipo', {
        title: 'Control de Inventario',
        modelos: modelos
      })
    }
  })
})


//Capturar tipo
app.get('/inventario/vehiculo/:tipo', (req, res) => {
  ModeloVehiculo.find({tipo: req.params.tipo}, (err, modeloVehiculos) => {
    if(err){
      console.log(err)
    }else{
      res.render('modelo', {
        modeloVehiculos: modeloVehiculos
      })
    }
  })
})


//Capturar modelo
app.get('/inventario/vehiculo/:tipo/:modelo', (req, res) => {
  ModeloVehiculo.findOne({modelo: req.params.modelo, tipo: req.params.tipo}, (err, modelo) => {
    Vehiculo
    .find({modelo: modelo._id})
    .populate('modelo')
    .exec((err, vehiculos) => {
      //res.json(vehiculos)
      //console.log('The stories JSON is an array: ', vehiculos)
      res.render('vehiculos',{
        vehiculos: vehiculos
      })
    })
  })
})


//Capturar Vehiculo
app.get('/inventario/vehiculo/:tipo/:modelo/:_id', (req, res) => {
  Vehiculo.findById(req.params._id, (err, vehiculo) => {
    res.render('vehiculo', {
      vehiculo: vehiculo
    })
  })
})



app.listen(3000, function(){
  console.log('Server started on port 3000...');
});
