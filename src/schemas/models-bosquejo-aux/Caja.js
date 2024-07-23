const CajaSchema = new Schema({
  tipo: {
    type: String,
    enum: [
      "efectivo",
      "MercadoPago",
      "dolar",
      "BancoCorrientes",
      "BancoNaranjaX",
    ],
  },
  saldoInicial: Number,
  saldoFinal: Number,
  movimientos: [
    {
      tipo: { type: String, enum: ["ingreso", "egreso"] },
      monto: Number,
      concepto: String,
      fecha: Date,
    },
  ],
  fechaApertura: Date,
  fechaCierre: Date,
  turno: { type: String, enum: ["mañana", "tarde"] },
});
