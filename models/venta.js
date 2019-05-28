let mongoose = require('mongoose');

let vehiculoSchema = mongoose.Schema({
  idRegistro: {
    type: Number,
    required: true
  },
  cuerpoSalida: {
    type: Array
  },
  fSalida: {
    type: Date
  }
})


let Venta = module.exports = mongoose.model('Venta', vehiculoSchema, "ventas");
