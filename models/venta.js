let mongoose = require('mongoose');

let vehiculoSchema = mongoose.Schema({
  idRegistro: {
    type: Number,
    required: true
  },
  cuerpoSalida: {
    type: Array
  }
})


let Venta = module.exports = mongoose.model('Venta', vehiculoSchema, "ventas");
