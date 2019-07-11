const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


//Models
let ModeloVehiculo = require('../models/modeloVehiculo')
let Vehiculo = require('../models/vehiculo')
let ModeloRepuesto = require('../models/modeloRepuesto')
let Repuesto = require('../models/repuesto')
let User = require('../models/user')


//Entrada de Productos
router.get('/', ensureAuthenticated, (req, res) => {
  res.render('registroEntrada', {
    title: 'Registro Entrada de Productos',
    user: req.user.rol

  })
})



//GET - Productos
router.get('/nuevo/:producto', ensureAuthenticated, (req, res) => {
  if(req.params.producto.toLowerCase() == 'vehiculo'){
    ModeloVehiculo.find({}, (err, modelos) => {
      if(modelos != null){
        res.render('nuevaEntrada', {
          title: 'Ingreso de Stock de Vehiculos',
          modelos: modelos,
          user: req.user.rol,
          producto: 'vehiculo'
        })
      }
    })
  }else if(req.params.producto.toLowerCase() == 'repuesto'){
    ModeloRepuesto.find({}, (err, modelos) => {
      if(modelos != null){
        res.render('nuevaEntrada', {
          title: 'Ingreso de Stock de Repuestos',
          modelos: modelos,
          user: req.user.rol,
          producto: 'repuesto'
        })
      }
    })
  }else{
    req.flash('warning', 'Pagina no encontrada')
    res.redirect('/registroEntrada')
  }
})



//POST - Generar entrada de producto -> Vehiculo
router.post('/nuevo/vehiculo', ensureAuthenticated, (req, res) => {
  const cantidad = req.body.cantidad
  const modelo = req.body.modelo
  const color = req.body.color
  const almacen = req.body.almacen

  stock = []

  ModeloVehiculo.findOne({modelo: modelo}, (err, modeloV) => {
    for (i = 0; i < cantidad; i++){
      let vehiculo = new Vehiculo({
        modelo: modeloV,
        color: color,
        almacen: almacen,
        piso: 1,
        fila: 2,
        columna: 3,
        fechaEntrada: Date.now(),
        _id: new mongoose.Types.ObjectId
        })
      stock.push(vehiculo)
    }
    console.log(stock)
    Vehiculo.insertMany(stock)
    req.flash('success', 'Productos registrados correctamente');
    res.redirect('/registroEntrada')
  })
})

//POST - Guardar nuevo producto -> Repuesto
router.post('/nuevo/repuesto', ensureAuthenticated, (req, res) => {
  const tipo = req.body.tipo;
  const modelo = req.body.modelo;
  const numeroEmpaque = req.body.numeroEmpaque;
  const almacen = req.body.almacen;
  const calidad = req.body.calidad;
  const color = req.body.color;
  const cantidad = req.body.cantidad;
  stock = []

  ModeloRepuesto.findOne({modelo: modelo, tipo: tipo}, (err, modeloR) => {
    if(modelo != null){
      for (i = 0; i < cantidad; i++){
        let repuesto = new Repuesto({
          modelo: modeloR,
          almacen: almacen,
          color: color,
          numeroEmpaque: numeroEmpaque,
          calidad: calidad,
          piso: 1,
          fila: 2,
          columna: 3,
          fechaEntrada: Date.now(),
          _id: new mongoose.Types.ObjectId
          })
        stock.push(repuesto)
      }
      Repuesto.insertMany(stock)
      req.flash('success', 'Productos registrados correctamente');
      res.redirect('/registroEntrada')
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
