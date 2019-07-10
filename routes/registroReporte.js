const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', ensureAuthenticated, (req, res) => {
  res.render('registroReportes', {
    user: req.user.rol
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
