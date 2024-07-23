const GastoSchema = new Schema({
  concepto: String,
  monto: Number,
  fecha: Date,
  categoria: { type: String, enum: ["fijo", "variable", "extraordinario"] },
  recurrente: Boolean,
  frecuencia: {
    type: String,
    enum: ["mensual", "bimestral", "trimestral", "anual"],
  },
});
