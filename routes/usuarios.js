const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


//Models
let User = require('../models/user');


//Usuarios
router.get('/', ensureAuthenticated, (req, res) => {
  if(req.user.rol == "Administrador"){
    User.find({}, (err, usuarios) => {
      res.render('registroUsuario', {
        title: 'Control de Usuarios',
        usuarios: usuarios,
        user: req.user.rol
      })
    })
  }
  else{
    res.redirect('/inventario')
  }
})

//Editar Usuario
router.get('/:_id', ensureAuthenticated, (req, res) => {
  if(req.user.rol == "Administrador"){
    User.findById(req.params._id, (err, usuario) => {
      if(usuario != null){
        res.render('editarUsuario', {
          title: 'Usuario - ' + usuario.nombre,
          usuario: usuario,
          user: req.user.rol
        })
      }else{
        console.log("Usuario no existente")
        res.redirect('/usuarios')
      }
    })
  }
  else{
    res.redirect('/inventario')
  }
})


//Guardar Usuario -> Editado
router.post('/:_id', ensureAuthenticated, (req, res) => {
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
