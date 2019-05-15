let mongoose = require('mongoose');

let vehiculoSchema = mongoose.Schema({
  idRegistro: {
    type: number,
    required: true
  },
  cuerpoSalida: {

  },
  total: {

  }
})


let Venta = module.exports = mongoose.model('Venta', vehiculoSchema, "ventas");
