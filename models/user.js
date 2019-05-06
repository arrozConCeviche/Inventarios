let mongoose = require('mongoose')

let UserSchema = mongoose.Schema({
  nombre:{
    type: String,
    required: true
  },
  dni:{
    type: String,
    required: true
  },
  direccion:{
    type: String,
    required: true
  },
  sexo:{
    type: String,
    required: true
  },
  telefono:{
    type: Number,
    required: true
  },
  estadoLaboral:{
    type: String,
    required: true
  },
  usuario:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
  rol:{
    type: String,
    required: true
  }
});

const User = module.exports = mongoose.model('User', UserSchema)
