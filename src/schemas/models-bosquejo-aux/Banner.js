const BannerSchema = new Schema({
  imagen: String,
  titulo: String,
  descripcion: String,
  enlace: String,
  activo: Boolean,
  fechaInicio: Date,
  fechaFin: Date,
});
