const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


//Models
let ModeloVehiculo = require('../models/modeloVehiculo')
let ModeloRepuesto = require('../models/modeloRepuesto')
let User = require('../models/user')


//Ingresar a Productos
router.get('/', ensureAuthenticated, (req, res) => {
  if(req.user.rol == "Administrador"){
    ModeloVehiculo.find({}, (err, modelos) => {
      res.render('registroProductos', {
        title: 'Registro de Modelos',
        modelos: modelos,
        user: req.user.rol

      })
    })
  }
  else{
    res.redirect('/inventario')
  }
})


//Ingresar Crear modelo Vehiculo
router.get('/nuevo/modeloVehiculo',  (req, res) => {
  if(req.user.rol == "Administrador"){
    res.render('nuevoModeloVehiculo', {
      title: 'Crear Nuevo Modelo de Vehiculo',
      user: req.user.rol

    })
  }
  else{
    res.redirect('/inventario')
  }
})


//Ingresar Crear modelo Repuesto
router.get('/nuevo/modeloRepuesto', ensureAuthenticated, (req, res) => {
  if(req.user.rol == "Administrador"){
    res.render('nuevoModeloRepuesto', {
      title: 'Crear Nuevo Modelo de Repuesto',
      user: req.user.rol
    })
  }
  else{
    res.redirect('/inventario')
  }
})


//Ingresar Editar Vehiculo
router.get('/editar/vehiculo', ensureAuthenticated, (req, res) => {
  if(req.user.rol == "Administrador"){
    ModeloVehiculo.find({}, (err, modelosV) => {
      res.render('editarModeloPrincipal', {
        title: 'Editar Vehiculo',
        modelosV: modelosV,
        tipo: 'vehiculo',
        user: req.user.rol
      })
    })
  }
  else{
    res.redirect('/inventario')
  }
})


//Ingresar Editar Repuesto
router.get('/editar/repuesto', (req, res) => {
  if(req.user.rol == "Administrador"){
    ModeloRepuesto.find({}, (err, modelosR) => {
      res.render('editarModeloPrincipal', {
        title: 'Editar Repuesto',
        modelosR: modelosR,
        tipo: 'repuesto',
        user: req.user.rol

      })
    })
  }
  else{
    res.redirect('/inventario')
  }
})


//Guardar nuevo producto -> Vehiculo
router.post('/nuevo/modeloVehiculo', ensureAuthenticated, (req, res) => {
  const tipo = req.body.tipo;
  const modelo = req.body.modelo;
  const paisOrigen = req.body.paisOrigen;
  const sunroof = req.body.sunroof;
  const neumaticoRepuesto = req.body.neumaticoRepuesto;
  const seguridad = req.body.seguridad;
  const pVenta = req.body.pVenta;

  req.checkBody('tipo', 'Tipo es Obligatorio').notEmpty();
  req.checkBody('modelo', 'Modelo es Obligatorio').notEmpty();
  req.checkBody('paisOrigen', 'Pais de Origen es Obligatorio').notEmpty();
  req.checkBody('sunroof', 'Sunroof es Obligatorio').notEmpty();
  req.checkBody('neumaticoRepuesto', 'Seleccionar si existe neumatico de repuesto').notEmpty();
  req.checkBody('seguridad', 'Determinar nivel de seguridad').notEmpty();
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
      seguridad: seguridad,
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


//Guardar nuevo producto -> Repuesto
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
      req.flash('success', 'Modelo creado correctamente');
      res.redirect('/registroProductos')
    }
  })
})


//Editar Modelo de Producto
router.get('/editar/:_id', ensureAuthenticated, (req, res) => {
  if(req.user.rol == "Administrador"){
    ModeloVehiculo.findById(req.params._id, (err, modeloV) => {
      if(modeloV != null){
        res.render('editarModelo', {
          title: "Editar - " + modeloV.modelo,
          modelo: modeloV,
          tipo: 'vehiculo',
          user: req.user.rol

        })
      }else{
        ModeloRepuesto.findById(req.params._id, (err, modeloR) => {
          res.render('editarModelo', {
            title: "Editar - " + modeloR.tipo + " de " + modeloR.modelo,
            modelo: modeloR,
            tipo: 'repuesto',
            user: req.user.rol

          })
        })
      }
    })
  }
  else{
    res.redirect('/inventario')
  }
})


//Guardar Modelo Editado
router.post('/editar/:_id', ensureAuthenticated, (req, res) => {
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
        req.flash('success', 'Modelo Actualizado');
        res.redirect('/registroProductos/editar/vehiculo')

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
            req.flash('success', 'Modelo Actualizado');
            res.redirect('/registroProductos/editar/repuesto')

          })
        }
        else{
          console.log('Producto no encontrado')
          res.redirect('/')
        }
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
