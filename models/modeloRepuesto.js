let mongoose = require('mongoose');

let modeloRepuestoSchema = mongoose.Schema({
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
  numeroEmpaque:{
    type: Number,
    required: true
  },
  calidad:{
    type: Number,
    required: true
  }
});

let ModeloRepuesto = module.exports = mongoose.model('ModeloRepuesto', modeloRepuestoSchema, "modeloRepuestos");
