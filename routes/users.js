const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')

//Cargar Model
let User = require('../models/user');


//Registrar - Vista
router.get('/registrar', (req, res) => {
  res.render('crearUsuario', {
    title: 'Crear Usuario'
  })
});


router.post('/registrar', (req, res) => {
  const nombre = req.body.nombre;
  const dni = req.body.dni;
  const direccion = req.body.direccion;
  const sexo = req.body.sexo;
  const telefono = req.body.telefono;
  const estadoLaboral = req.body.estadoLaboral;
  const username = req.body.username;
  const password = req.body.password;
  const rol = req.body.rolUsuario;


  req.checkBody('nombre', 'Nombre es obligatorio').notEmpty();
  req.checkBody('dni', 'DNI es obligatorio').notEmpty();
  req.checkBody('direccion', 'Direccion es obligatoria').notEmpty();
  req.checkBody('sexo', 'Campo Sexo es obligatorio').notEmpty();
  req.checkBody('telefono', 'Telefono es obligatorio').notEmpty();
  req.checkBody('estadoLaboral', 'Especificar Estado Laboral').notEmpty();
  req.checkBody('username', 'Usuario es obligatorio').isEmail();
  req.checkBody('password', 'Contraseña es obligatoria').notEmpty();
  req.checkBody('rolUsuario', 'Especificar Rol de Usuario').notEmpty();


  let errors = req.validationErrors();
  if(errors){
    res.render('crearUsuario', {
      errors:errors
    });
  }else{
    let newUser = new User({
      nombre: nombre,
      dni: dni,
      direccion: direccion,
      sexo: sexo,
      telefono: telefono,
      estadoLaboral: estadoLaboral,
      username: username,
      password: password,
      rol: rol
    })
    bcrypt.genSalt(10, (err,salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if(err){
          console.log(err)
        }
        newUser.password = hash;
        console.log(hash)
        /newUser.save((err) => {
          if(err){
            console.log(err);
            return;
          }
          console.log('usuario creado')
          res.redirect('/')
        })
      })
    })
  }
})
module.exports = router;
