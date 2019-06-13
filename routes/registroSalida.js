const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


//Models
let ModeloVehiculo = require('../models/modeloVehiculo')
let Vehiculo = require('../models/vehiculo')
let ModeloRepuesto = require('../models/modeloRepuesto')
let Repuesto = require('../models/repuesto')
let Venta = require('../models/venta')


//Registro de Salida
router.get('/', ensureAuthenticated, (req, res) => {
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
router.get('/nuevo', ensureAuthenticated, (req, res) => {
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
router.post('/nuevo', ensureAuthenticated, (req, res) => {
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
