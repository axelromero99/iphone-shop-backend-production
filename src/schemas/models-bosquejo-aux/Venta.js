const VentaSchema = new Schema({
  producto: { type: Schema.Types.ObjectId, ref: "Producto" },
  cliente: { type: Schema.Types.ObjectId, ref: "Usuario" },
  fecha: Date,
  precioUSD: Number,
  precioARS: Number,
  metodoPago: { type: String, enum: ["efectivo", "tarjeta", "transferencia"] },
  estado: String,
  seña: Number,
  equipoRecibido: {
    modelo: String,
    porcentaje: Number,
    accesorios: [String],
  },
  factura: {
    tipo: { type: String, enum: ["electronica", "X"] },
    numero: String,
  },
});
