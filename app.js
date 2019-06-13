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

mongoose.connect(config.database, { useNewUrlParser: true });
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
let Repuesto = require('./models/repuesto')
let Venta = require('./models/venta')
let User = require('./models/user')


//Inicio
app.get('/', (req, res) => {
  res.render('login')
})


//Iniciar Sesion
app.post('/', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/inventario',
    failureRedirect: '/',
    failureFlash: true
  })(req, res, next);
})


//Control de Accesos
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }else{
    req.flash('danger', 'Login por favor')
    res.redirect('/')
  }
}

/*
/////// R E P U E S T O S \\\\\\\
app.get('/inventario/repuesto/', ensureAuthenticated, (req, res) => {
  ModeloRepuesto.find({}, (err, modelos) => {
    if(err){
      console.log(err)
    }else {
      console.log(req.user.rol)
      res.render('tipo', {
        title: 'Control de Inventario',
        modelos: modelos
      })
    }
  })
})
*/

//Router
let users = require('./routes/users')
app.use('/users', users)

let inventario = require('./routes/inventario')
app.use('/inventario', inventario)
let registroProductos = require('./routes/registroProductos')
app.use('/registroProductos', registroProductos)
let registroEntrada = require('./routes/registroEntrada')
app.use('/registroEntrada', registroEntrada)
let registroSalida = require('./routes/registroSalida')
app.use('/registroSalida', registroSalida)
let usuarios = require('./routes/usuarios')
app.use('/usuarios', usuarios)

/*
//Editar Usuario
app.get('/usuarios/:_id', ensureAuthenticated, (req, res) => {
  User.findById(req.params._id, (err, usuario) => {
    if(usuario != null){
      res.render('editarUsuario', {
        title: 'Usuario - ' + usuario.nombre,
        usuario: usuario
      })
    }else{
      console.log("Usuario no existente")
      res.redirect('/usuarios')
    }
  })
})


//Guardar Usuario -> Editado
app.post('/usuarios/:_id', (req, res) => {
  let usuario = {}
  if(req.body.nombre != ''){
    usuario.nombre = req.body.nombre
  }
  if(req.body.direccion != ''){
    usuario.direccion = req.body.direccion
  }
  if(req.body.dni != ''){
    usuario.dni = req.body.dni
  }
  if(req.body.sexo != ''){
    usuario.sexo = req.body.sexo
  }
  if(req.body.telefono != ''){
    usuario.telefono = req.body.telefono
  }
  if(req.body.rol != ''){
    usuario.rol = req.body.rol
  }
  if(req.body.estadoLaboral != ''){
    usuario.estadoLaboral = req.body.estadoLaboral
  }

  let query = {_id: req.params._id}

  User.update(query, usuario, (err) => {
    if(err){
      console.log(err)
      return
    }else{
      res.redirect('/usuarios')
    }
  })
})
*/

app.listen(3000, function(){
  console.log('Server started on port 3000...');
});
