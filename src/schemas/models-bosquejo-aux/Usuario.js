const UsuarioSchema = new Schema({
  nombre: String,
  apellido: String,
  email: { type: String, unique: true },
  contraseña: String,
  rol: { type: String, enum: ['admin', 'vendedor', 'tecnico', 'cliente'] },
  telefono: String,
  dni: String
});