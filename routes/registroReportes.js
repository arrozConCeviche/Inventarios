const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');

moment.locale('es')

let Venta = require('../models/venta')


router.get('/', ensureAuthenticated, (req, res) => {
  Venta.find({}, (err, ventas) => {
    ventaMensual = [{mes: 'Enero', productosVendidos:[]},
                    {mes: 'Febrero', productosVendidos:[]},
                    {mes: 'Marzo', productosVendidos:[]},
                    {mes: 'Abril', productosVendidos:[]},
                    {mes: 'Mayo', productosVendidos:[]},
                    {mes: 'Junio', productosVendidos:[]},
                    {mes: 'Julio', productosVendidos:[]},
                    {mes: 'Agosto', productosVendidos:[]},
                    {mes: 'Septiembre', productosVendidos:[]},
                    {mes: 'Octubre', productosVendidos:[]},
                    {mes: 'Noviembre', productosVendidos:[]},
                    {mes: 'Diciembre', productosVendidos:[]}]

    for (var i = 0; i < ventaMensual.length; i++) {                                   // Iterar por mes
      for (var j = 0; j < ventas.length; j++) {
        mes = moment(ventas[j].fSalida, 'DDMMYYYY').format('MMMM')                    // Formato mes
        if (mes == ventaMensual[i].mes.toLowerCase()) {                               // Comparar meses
          for (var k = 0; k < ventas[j].cuerpoSalida.length; k++) {                   // Iterar en cuerpoSalida - Vehiculo y Repuesto
            for (var l = 0; l < ventas[j].cuerpoSalida[k].length; l++) {              // Iterar en productos vendidos - Venta
              for (var m = 0; m < ventaMensual[i].productosVendidos.length; m++) {    // Iterar en productos vendidos almacenados - Arreglo
                console.log('fin de iteracion')
                if (ventas[j].cuerpoSalida[k][l].modelo[0].modelo.toLowerCase() == ventaMensual[i].productosVendidos[m].producto.toLowerCase()) {
                  ventaMensual[i].productosVendidos[m].montoAcumulado = ventaMensual[i].productosVendidos[m].montoAcumulado + ventas[j].cuerpoSalida[k][l].modelo[0].pVenta
                  ventaMensual[i].productosVendidos[m].cantidad++
                  console.log(ventaMensual)
                  break
                }
                ventaMensual[i].productosVendidos.push({producto: ventas[j].cuerpoSalida[k][l].modelo[0].modelo, montoAcumulado: ventas[j].cuerpoSalida[k][l].modelo[0].pVenta, cantidad: 1})
                console.log(ventaMensual)
              }
            }
          }
        }
      }
    }
    console.log(ventaMensual)
    res.render('registroReportes', {
      user: req.user.rol,
      title: 'Reportes',
      ventas: ventaMensual
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
