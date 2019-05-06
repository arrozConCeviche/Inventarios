let mongoose = require('mongoose');

let vehiculoSchema = mongoose.Schema({
  color:{
    type: String,
    required: true
  },
  almacen:{
    type: String,
    required: true
  },
  piso:{
    type: Number,
    required: true
  },
  fila:{
    type: Number,
    required: true
  },
  columna:{
    type: Number,
    required: true
  },
  fechaEntrada:{
    type: Date,
    required: true
  },
  modelo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ModeloVehiculo'
  }
});

let Vehiculo = module.exports = mongoose.model('Vehiculo', vehiculoSchema, "vehiculos");
