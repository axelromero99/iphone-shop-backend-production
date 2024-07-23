const ServicioTecnicoSchema = new Schema({
  cliente: { type: Schema.Types.ObjectId, ref: "Usuario" },
  dispositivo: {
    modelo: String,
    imei: String,
    capacidad: String,
    color: String,
  },
  motivoIngreso: String,
  diagnostico: String,
  insumosUtilizados: [
    {
      insumo: { type: Schema.Types.ObjectId, ref: "Producto" },
      cantidad: Number,
    },
  ],
  costoUSD: Number,
  costoARS: Number,
  estado: String,
  imagenes: [{ url: String, fecha: Date }],
  pinDesbloqueo: String,
  fechaIngreso: Date,
  fechaSalida: Date,
  garantia: Boolean,
});
