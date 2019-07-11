const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


//Models
let ModeloVehiculo = require('../models/modeloVehiculo')
let Vehiculo = require('../models/vehiculo')
let ModeloRepuesto = require('../models/modeloRepuesto')
let Repuesto = require('../models/repuesto')
let Venta = require('../models/venta')
let User = require('../models/user')

router.get('/', ensureAuthenticated, (req, res) => {
  Venta.find({}).sort({fSalida: -1}).find((err, ventas) =>{
    res.render('index', {
      user: req.user.rol,
      ventas: ventas,
    })
  })
})


/////// V E H I C U L O S \\\\\\\
//Capturar vehiculos
router.get('/:producto/', ensureAuthenticated, (req,res) => {
  if(req.params.producto =="vehiculo"){
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
          tipos: distinctModelo,
          user: req.user.rol,
          producto: 'vehiculo'
        })
      }
    })
  }else if (req.params.producto == "repuesto") {
    ModeloRepuesto.find({}, (err, modelos) => {
      if(err){
        console.log(err)
      }else {
        let modeloArray = new Array
        for(var x in modelos){
          modeloArray.push(modelos[x].tipo)
        }
        let distinctModelo = [...new Set(modeloArray)]
        res.render('tipo', {
          title: 'Control de Inventario',
          tipos: distinctModelo,
          user: req.user.rol,
          producto: 'repuesto'
        })
      }
    })
  }else{
    req.flash('warning', 'Pagina no encontrada')
    res.redirect('/inventario')
  }
})


//Capturar tipo
router.get('/:producto/:tipo', ensureAuthenticated, (req, res) => {
  if(req.params.producto == "vehiculo"){
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
          title: req.params.tipo,
          modeloVehiculos: distinctModelo,
          tipo: req.params.tipo,
          user: req.user.rol,
          producto: 'vehiculo'
        })
      }
    })
  }else if (req.params.producto == "repuesto") {
    ModeloRepuesto.find({tipo: req.params.tipo}, (err, modelos) => {
      if(err){
        console.log(err)
      }else{
        let modeloArray = new Array
        for(var x in modelos){
          modeloArray.push(modelos[x].modelo)
        }
        let distinctModelo = [...new Set(modeloArray)]
        res.render('modelo', {
          title: req.params.tipo,
          modeloVehiculos: distinctModelo,
          tipo: req.params.tipo,
          user: req.user.rol,
          producto: 'repuesto'
        })
      }
    })
  }

})


//Capturar modelo
router.get('/:producto/:tipo/:modelo', ensureAuthenticated, (req, res) => {
  if(req.params.producto == "vehiculo"){
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
        console.log(vehiculos)
        res.render('vehiculos',{
          vehiculos: vehiculos,
          stock: objLength(vehiculos),
          modelo: modelo,
          title: modelo.modelo,
          user: req.user.rol
        })
      })
    })
  }else if (req.params.producto == "repuesto") {
    ModeloRepuesto.findOne({modelo: req.params.modelo, tipo: req.params.tipo}, (err, modelo) => {
      Repuesto.find({modelo: {$elemMatch: {modelo: modelo.modelo}}}, (err, Repuesto) =>{
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
          title: modelo.modelo,
          user: req.user.rol
        })
      })
    })
  }

})


//Capturar Vehiculo
router.get('/vehiculo/:tipo/:modelo/:_id', ensureAuthenticated, (req, res) => {
  ModeloVehiculo.findOne({modelo: req.params.modelo, tipo: req.params.tipo}, (err, modelo) => {
    Vehiculo.findById(req.params._id, (err, vehiculo) => {
      res.render('vehiculo', {
        vehiculo: vehiculo,
        title: 'Vehiculo:  ' + vehiculo.id,
        user: req.user.rol
      })
    })
  })
})

//Editar Vehiculo
router.get('/vehiculo/:tipo/:modelo/:_id/editar', ensureAuthenticated, (req,res) => {
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
          modelos: distinctModelo,
          user: req.user.rol
        })
      }
    })
  })
})


//Guardar Cambio Vehiculo -> Editar Vehiculo
router.post('/vehiculo/:tipo/:modelo/:_id/editar', ensureAuthenticated, (req, res) => {

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
        req.flash('success', 'Cambios guardados correctamente');
        res.redirect('/inventario/vehiculo/'+vehiculo.modelo[0].tipo+'/'+vehiculo.modelo[0].modelo)
      })
    }
  })
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


module.exports = router;
