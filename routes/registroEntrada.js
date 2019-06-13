const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


//Models
let ModeloVehiculo = require('../models/modeloVehiculo')
let Vehiculo = require('../models/vehiculo')
let ModeloRepuesto = require('../models/modeloRepuesto')
let Repuesto = require('../models/repuesto')


//Entrada de Productos
router.get('/', ensureAuthenticated, (req, res) => {
  res.render('registroEntrada', {
    title: 'Registro Entrada de Productos'
  })
})


//GET - Entrada de Vehiculos
router.get('/nuevo/vehiculo', ensureAuthenticated, (req, res) => {
  ModeloVehiculo.find({}, (err, modelos) => {
    if(modelos != null){
      res.render('nuevaEntradaVehiculos', {
        title: 'Ingreso de Stock de Vehiculos',
        modelos: modelos
      })
    }
  })
})


//GET - Entrada de Repuestos
router.get('/nuevo/repuesto', ensureAuthenticated, (req, res) => {
  ModeloRepuesto.find({}, (err, modelos) => {
    if(modelos != null){
      res.render('nuevaEntradaRepuestos', {
        title: 'Ingreso de Stock de Repuestos',
        modelos: modelos
      })
    }
  })
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
    Vehiculo.insertMany(stock)
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
