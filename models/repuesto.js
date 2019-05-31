let mongoose = require('mongoose');

let repuestoSchema = mongoose.Schema({
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
    type: Array
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

let Repuesto = module.exports = mongoose.model('Repuesto', repuestoSchema, "repuestos");
