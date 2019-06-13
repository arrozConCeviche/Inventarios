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
let registroEntrada = require('./routes/registroEntrada')
app.use('/registroEntrada', registroEntrada)
let registroSalida = require('./routes/registroSalida')
app.use('/registroSalida', registroSalida)
let inventario = require('./routes/inventario')
app.use('/inventario', inventario)
/*
//inicio Inventario
app.get('/inventario', ensureAuthenticated, (req, res) => {
  console.log(req.user.nombre)
  res.render('index')
})
*/
/*
/////// V E H I C U L O S \\\\\\\
//Capturar vehiculos
app.get('/inventario/vehiculo/', ensureAuthenticated, (req,res) => {
  ModeloVehiculo.find({}, (err, modelos) => {
    if(err){
      console.log(err)
    }else{
      let modeloArray = new Array
      for(var x in modelos){
        modeloArray.push(modelos[x].tipo)
      }
      let distinctModelo = [...new Set(modeloArray)]
      res.render('tipo', {
        title: 'Control de Inventario',
        tipos: distinctModelo
      })
    }
  })
})

/*
//Registro de Salida
app.get('/registroSalida/', ensureAuthenticated, (req, res) => {
  Venta.find({}, (err, ventas) => {
    ModeloRepuesto.find({}, (err, modelosR) => {
      ModeloVehiculo.find({}, (err, modelosV) => {
        res.render('registroSalida', {
          title: 'Registro de Salida de Producto',
          ventas: ventas,
          modelosV: modelosV,
          modelosR: modelosR
        })
      })
    })
  })
})


//Nuevo Registro
app.get('/registroSalida/nuevo', ensureAuthenticated, (req, res) => {
  Venta.findOne({}, {}, {sort: {'idRegistro' : -1}}, (err, venta) => {
    if(venta != null){
      console.log(venta)
      ModeloVehiculo.find({}, (err, modelosV) => {
        Vehiculo.find({}, (err, vehiculos) => {
          ModeloRepuesto.find({}, (err, modelosR) => {
            Repuesto.find({}, (err, repuestos) => {
              res.render('nuevaSalida', {
                title: 'Nuevo Registro de Salida de Producto',
                id: venta.idRegistro + 1,
                modelosV: modelosV,
                vehiculos: vehiculos,
                modelosR: modelosR,
                repuestos: repuestos
              })
            })
          })
        })
      })
    }else{
      ModeloVehiculo.find({}, (err, modelosV) => {
        Vehiculo.find({}, (err, vehiculos) => {
          ModeloRepuesto.find({}, (err, modelosR) => {
            Repuesto.find({}, (err, repuestos) => {
              res.render('nuevaSalida', {
                title: 'Nuevo Registro de Salida de Producto',
                id: 1,
                modelosV: modelosV,
                vehiculos: vehiculos,
                modelosR: modelosR,
                repuestos: repuestos
              })
            })
          })
        })
      })
    }
  })
})


//Guardar Registro
app.post('/registroSalida/nuevo', (req, res) => {
  let vendidos = req.body.vendidos
  let descrip = []
  Vehiculo.find({_id: {$in: mongoose.Types.Array(vendidos)}}, (err, vVendidos) => {
    Repuesto.find({_id: {$in: mongoose.Types.Array(vendidos)}}, (err, rVendidos) => {
      descrip.push(vVendidos, rVendidos)
      Venta.findOne({}, {}, {sort: {'idRegistro' : -1}}, (err, ultimaVenta) => {
        if(ultimaVenta != null){
          let venta = new Venta({
            idRegistro: ultimaVenta.idRegistro+1,
            cuerpoSalida: descrip,
            fSalida: Date.now()
          })
          venta.save()
        }
        else{
          let venta = new Venta({
            idRegistro: 1,
            cuerpoSalida: descrip,
            fSalida: Date.now()
          })
          venta.save()
        }
        Vehiculo.deleteMany({_id: {$in: mongoose.Types.Array(vendidos)}}, (err, vehiculos) => {
          Repuesto.deleteMany({_id: {$in: mongoose.Types.Array(vendidos)}}, (err, repuestos) => {
            res.redirect('/registroSalida/')
          })
        })
      })
    })
  })
})
*/

//Ingresar a Productos
app.get('/registroProductos', ensureAuthenticated, (req, res) => {
  ModeloVehiculo.find({}, (err, modelos) => {
    res.render('registroProductos', {
      title: 'Registro de Modelos',
      modelos: modelos
    })
  })
})


//Ingresar Crear modelo Vehiculo
app.get('/registroProductos/nuevo/modeloVehiculo', ensureAuthenticated,  (req, res) => {
  res.render('nuevoModeloVehiculo', {
    title: 'Crear Nuevo Modelo de Vehiculo'
  })
})


//Ingresar Crear modelo Repuesto
app.get('/registroProductos/nuevo/modeloRepuesto', ensureAuthenticated, (req, res) => {
  res.render('nuevoModeloRepuesto', {
    title: 'Crear Nuevo Modelo de Repuesto'
  })
})


//Ingresar Editar Vehiculo
app.get('/registroProductos/editar/vehiculo', ensureAuthenticated, (err, res) => {
  ModeloVehiculo.find({}, (err, modelosV) => {
    res.render('editarModeloPrincipal', {
      title: 'Editar Modelo',
      modelosV: modelosV,
      tipo: 'vehiculo'
    })
  })
})


//Ingresar Editar Repuesto
app.get('/registroProductos/editar/repuesto', ensureAuthenticated, (err, res) => {
  ModeloRepuesto.find({}, (err, modelosR) => {
    res.render('editarModeloPrincipal', {
      title: 'Editar Modelo',
      modelosR: modelosR,
      tipo: 'repuesto'
    })
  })
})


//Guardar nuevo producto -> Vehiculo
app.post('/registroProductos/nuevo/modeloVehiculo', (req, res) => {
  const tipo = req.body.tipo;
  const modelo = req.body.modelo;
  const paisOrigen = req.body.paisOrigen;
  const sunroof = req.body.sunroof;
  const neumaticoRepuesto = req.body.neumaticoRepuesto;
  const nivelSeguridad = req.body.nivelSeguridad;
  const pVenta = req.body.pVenta;

  req.checkBody('tipo', 'Tipo es Obligatorio').notEmpty();
  req.checkBody('modelo', 'Modelo es Obligatorio').notEmpty();
  req.checkBody('paisOrigen', 'Pais de Origen es Obligatorio').notEmpty();
  req.checkBody('sunroof', 'Sunroof es Obligatorio').notEmpty();
  req.checkBody('neumaticoRepuesto', 'Seleccionar si existe neumatico de repuesto').notEmpty();
  req.checkBody('nivelSeguridad', 'Determinar nivel de seguridad').notEmpty();
  req.checkBody('pVenta', 'Ingresar precio venta').notEmpty();

  let errors = req.validationErrors();
  if(errors){
    res.render('nuevoModeloVehiculo', {
      errors:errors
    });
  }else{
    let nuevoModeloVehiculo = new ModeloVehiculo({
      tipo: tipo,
      modelo: modelo,
      paisOrigen: paisOrigen,
      sunroof: sunroof,
      neumaticoRepuesto: neumaticoRepuesto,
      seguridad: nivelSeguridad,
      pVenta: pVenta
    })
    nuevoModeloVehiculo.save((err) => {
      if (err){
        console.log(err)
        return
      }
      console.log('nuevo modelo ingresado')
      res.redirect('/registroProductos')
    })
  }
})


//Ver Usuarios
app.get('/usuarios', ensureAuthenticated, (req, res) => {
  User.find({}, (err, usuarios) => {
    res.render('registroUsuario', {
      title: 'Panel de Usuarios',
      usuarios: usuarios
    })
  })
})

/*
//Capturar tipo
app.get('/inventario/vehiculo/:tipo', ensureAuthenticated, (req, res) => {
  ModeloVehiculo.find({tipo: req.params.tipo}, (err, modelos) => {
    if(err){
      console.log(err)
    }else{
      let modeloArray = new Array
      for(var x in modelos){
        modeloArray.push(modelos[x].modelo)
      }
      let distinctModelo = [...new Set(modeloArray)]
      res.render('modelo', {
        modeloVehiculos: distinctModelo,
        tipo: req.params.tipo
      })
    }
  })
})


//Capturar modelo
app.get('/inventario/vehiculo/:tipo/:modelo',ensureAuthenticated, (req, res) => {
  ModeloVehiculo.findOne({modelo: req.params.modelo, tipo: req.params.tipo}, (err, modelo) => {
    Vehiculo.find({modelo: {$elemMatch: {modelo: modelo.modelo}}}, (err, vehiculos) =>{
      function objLength(obj){
        var i=0;
        for (var x in obj){
          if(obj.hasOwnProperty(x)){
            i++;
          }
        }
        return i;
      }
      res.render('vehiculos',{
        vehiculos: vehiculos,
        stock: objLength(vehiculos),
        modelo: modelo,
        title: modelo.modelo
      })
    })
  })
})


//Capturar Vehiculo
app.get('/inventario/vehiculo/:tipo/:modelo/:_id', ensureAuthenticated, (req, res) => {
  ModeloVehiculo.findOne({modelo: req.params.modelo, tipo: req.params.tipo}, (err, modelo) => {
    Vehiculo.findById(req.params._id, (err, vehiculo) => {
      res.render('vehiculo', {
        vehiculo: vehiculo,
        title: 'Vehiculo:  ' + vehiculo.id
      })
    })
  })
})

//Editar Vehiculo
app.get('/inventario/vehiculo/:tipo/:modelo/:_id/editar', ensureAuthenticated, (req,res) => {
  Vehiculo.findById(req.params._id, (err, vehiculo) => {
    ModeloVehiculo.find({}, (err, modelos) => {
      if(err){
        console.log(err)
      }else{
        let modeloArray = new Array
        for(var x in modelos){
          modeloArray.push(modelos[x].modelo)
        }
        let distinctModelo = [...new Set(modeloArray)]
        res.render('editarVehiculo', {
          title: 'Editar Vehiculo - ' + vehiculo._id,
          vehiculo: vehiculo,
          modelos: distinctModelo
        })
      }
    })
  })
})


//Guardar Cambio Vehiculo -> Editar Vehiculo
app.post('/inventario/vehiculo/:tipo/:modelo/:_id/editar', (req, res) => {

  const nuevoModelo = req.body.modelo
  const nuevoColor = req.body.color
  const nuevoAlmacen = req.body.almacen

  Vehiculo.findById(req.params._id, (err, vehiculo) => {
    if (vehiculo != null) {
      let vehiculoNuevo = {}
      if(nuevoModelo != ''){
        console.log(vehiculo.modelo[0])
        ModeloVehiculo.findOne({modelo: nuevoModelo}, (err, modelo) => {
          let arrAux = []
          arrAux.push(modelo)
          vehiculoNuevo.modelo = arrAux
        })
      }

      if(nuevoColor != ''){
        vehiculoNuevo.color=nuevoColor
        console.log(vehiculo.modelo[0])
      }

      if(nuevoAlmacen != ''){
        vehiculoNuevo.almacen = nuevoAlmacen
      }

      let query = {_id: req.params._id}

      Vehiculo.update(query, vehiculoNuevo, (err) => {
        if(err){
          console.log(err)
          return
        }
      })

      res.redirect('/inventario/vehiculo/'+vehiculo.modelo[0].tipo+'/'+vehiculo.modelo[0].modelo)
    }
  })
})

*/
//Editar Modelo de Producto
app.get('/registroProductos/editar//:tipo/:_id', ensureAuthenticated, (req, res) => {
  ModeloVehiculo.findById(req.params._id, (err, modeloV) => {
    if(modeloV != null){
      res.render('editarModelo', {
        title: "Editar - " + modeloV.modelo,
        modelo: modeloV,
        tipo: 'vehiculo'
      })
    }else{
      ModeloRepuesto.findById(req.params._id, (err, modeloR) => {
        res.render('editarModelo', {
          title: "Editar - " + modeloR.tipo + " de " + modeloR.modelo,
          modelo: modeloR,
          tipo: 'repuesto'
        })
      })
    }
  })
})


//Guardar Modelo Editado
app.post('/registroProductos/editar/:_id', (req, res) => {
  ModeloVehiculo.findById(req.params._id, (err, modeloV) => {
    if(modeloV != null){
      modelo_V = {}
      if(req.body.tipo != ''){
        modelo_V.tipo = req.body.tipo
      }
      if(req.body.modelo != ''){
        modelo_V.modelo = req.body.modelo
      }
      if(req.body.paisOrigen != ''){
        modelo_V.paisOrigen = req.body.paisOrigen
      }
      if(req.body.sunroof != ''){
        modelo_V.sunroof = req.body.sunroof
      }
      if(req.body.neumaticoRepuesto != ''){
        modelo_V.neumaticoRepuesto = req.body.neumaticoRepuesto
      }
      if(req.body.seguridad != ''){
        modelo_V.seguridad = req.body.seguridad
      }
      if(req.body.pVenta != ''){
        modelo_V.pVenta = req.body.pVenta
      }
      let query_V = {_id: req.params._id}

      ModeloVehiculo.update(query_V, modelo_V, (err) => {
        if(err){
          console.log(err)
          return
        }
      })
    }else{
      ModeloRepuesto.findById(req.params._id, (err, modeloR) => {
        if(modeloR != null){
          let modelo_R = {}
          if(req.body.tipo != ''){
            modelo_R.tipo = req.body.tipo
          }
          if(req.body.modelo != ''){
            modelo_R.modelo = req.body.modelo
          }
          if(req.body.paisOrigen != ''){
            modelo_R.paisOrigen = req.body.paisOrigen
          }
          if(req.body.pVenta != ''){
            modelo_R.pVenta = req.body.pVenta
          }

          let query_R = {_id: req.params._id}

          ModeloRepuesto.update(query_R, modelo_R, (err) => {
            if(err){
              console.log(err)
              return
            }
          })
        }
        else{
          console.log('Producto no encontrado')
          res.redirect('/')
        }
      })
    }
    res.redirect('/registroProductos/editar')
  })
})


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


app.listen(3000, function(){
  console.log('Server started on port 3000...');
});
