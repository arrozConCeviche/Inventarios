let mongoose = require('mongoose');

let modeloVehiculoSchema = mongoose.Schema({
  tipo:{
    type: String,
    required: true
  },
  modelo:{
    type: String,
    required: true
  },
  paisOrigen:{
    type: String,
    required: true
  },
  pVenta:{
    type: Number,
    required: true
  },
  neumaticoRepuesto:{
    type: String,
    required: true
  },
  seguridad:{
    type: Number,
    required: true
  },
  sunroof:{
    type: String,
    required: true
  },
  stock: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehiculo'
  }]
});

let ModeloVehiculo = module.exports = mongoose.model('ModeloVehiculo', modeloVehiculoSchema, "modeloVehiculos");
