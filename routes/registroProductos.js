//Ingresar a Productos
app.get('/registroProductos', ensureAuthenticated, (req, res) => {
  ModeloVehiculo.find({}, (err, modelos) => {
    res.render('registroProductos', {
      title: 'Registro de Modelos',
      modelos: modelos
    })
  })
})


//Ingresar Crear modelo Vehiculo
app.get('/registroProductos/nuevo/modeloVehiculo', ensureAuthenticated,  (req, res) => {
  res.render('nuevoModeloVehiculo', {
    title: 'Crear Nuevo Modelo de Vehiculo'
  })
})


//Ingresar Crear modelo Repuesto
app.get('/registroProductos/nuevo/modeloRepuesto', ensureAuthenticated, (req, res) => {
  res.render('nuevoModeloRepuesto', {
    title: 'Crear Nuevo Modelo de Repuesto'
  })
})


//Ingresar Editar Vehiculo
app.get('/registroProductos/editar/vehiculo', ensureAuthenticated, (err, res) => {
  ModeloVehiculo.find({}, (err, modelosV) => {
    res.render('editarModeloPrincipal', {
      title: 'Editar Modelo',
      modelosV: modelosV,
      tipo: 'vehiculo'
    })
  })
})


//Ingresar Editar Repuesto
app.get('/registroProductos/editar/repuesto', ensureAuthenticated, (err, res) => {
  ModeloRepuesto.find({}, (err, modelosR) => {
    res.render('editarModeloPrincipal', {
      title: 'Editar Modelo',
      modelosR: modelosR,
      tipo: 'repuesto'
    })
  })
})


//Guardar nuevo producto -> Vehiculo
app.post('/registroProductos/nuevo/modeloVehiculo', (req, res) => {
  const tipo = req.body.tipo;
  const modelo = req.body.modelo;
  const paisOrigen = req.body.paisOrigen;
  const sunroof = req.body.sunroof;
  const neumaticoRepuesto = req.body.neumaticoRepuesto;
  const nivelSeguridad = req.body.nivelSeguridad;
  const pVenta = req.body.pVenta;

  req.checkBody('tipo', 'Tipo es Obligatorio').notEmpty();
  req.checkBody('modelo', 'Modelo es Obligatorio').notEmpty();
  req.checkBody('paisOrigen', 'Pais de Origen es Obligatorio').notEmpty();
  req.checkBody('sunroof', 'Sunroof es Obligatorio').notEmpty();
  req.checkBody('neumaticoRepuesto', 'Seleccionar si existe neumatico de repuesto').notEmpty();
  req.checkBody('nivelSeguridad', 'Determinar nivel de seguridad').notEmpty();
  req.checkBody('pVenta', 'Ingresar precio venta').notEmpty();

  let errors = req.validationErrors();
  if(errors){
    res.render('nuevoModeloVehiculo', {
      errors:errors
    });
  }else{
    let nuevoModeloVehiculo = new ModeloVehiculo({
      tipo: tipo,
      modelo: modelo,
      paisOrigen: paisOrigen,
      sunroof: sunroof,
      neumaticoRepuesto: neumaticoRepuesto,
      seguridad: nivelSeguridad,
      pVenta: pVenta
    })
    nuevoModeloVehiculo.save((err) => {
      if (err){
        console.log(err)
        return
      }
      console.log('nuevo modelo ingresado')
      res.redirect('/registroProductos')
    })
  }
})

//Guardar nuevo producto -> Repuesto
app.post('/registroEntrada/nuevo/repuesto', (req, res) => {
  const tipo = req.body.tipo;
  const modelo = req.body.modelo;
  const numeroEmpaque = req.body.numeroEmpaque;
  const almacen = req.body.almacen;
  const calidad = req.body.calidad;
  const color = req.body.color;
  const cantidad = req.body.cantidad;
  stock = []

  ModeloRepuesto.findOne({modelo: modelo, tipo: tipo}, (err, modeloR) => {
    if(modelo != null){
      for (i = 0; i < cantidad; i++){
        let repuesto = new Repuesto({
          modelo: modeloR,
          almacen: almacen,
          color: color,
          numeroEmpaque: numeroEmpaque,
          calidad: calidad,
          piso: 1,
          fila: 2,
          columna: 3,
          fechaEntrada: Date.now(),
          _id: new mongoose.Types.ObjectId
          })
        stock.push(repuesto)
      }
      Repuesto.insertMany(stock)
      res.redirect('/registroEntrada')
    }
  })
})
