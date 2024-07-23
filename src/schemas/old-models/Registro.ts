import mongoose, { Document, Model } from "mongoose";
import { customAlphabet } from 'nanoid';

export type SortOrder = -1 | 1;

// Custom alphabet excluding "-" and "_"
const customAlphabetWithoutDashUnderscore = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 11);

export interface IDiagnostico extends Document {
  tornillos?: boolean;
  botonPower?: boolean;
  carga?: boolean;
  botonHome?: boolean;
  touchFaceID?: boolean;
  trueTone?: boolean;
  flash?: boolean;
  camaraT1?: boolean;
  camaraT2?: boolean;
  camaraT3?: boolean;
  camaraFrontal?: boolean;
  giroscopio?: boolean;
  señal?: boolean;
  imei?: boolean;
  sensorProx?: boolean;
  parlanteInferior?: boolean;
  parlanteSuperior?: boolean;
  vibrador?: boolean;
  volumen?: boolean;
  condicionBat?: number;
  wifi?: boolean;
  microfono?: boolean;
  silencioSonido?: boolean;
  tactil?: boolean;
}


export interface IRegistro extends Document {
  modelo: string;
  otros: string;
  color: string;
  metodoPago: string;
  motivoIngreso: string;
  detalles: string;
  capacidad: string;
  montoSenado: string;
  DNI: string;
  comprobantePago: string;
  estadoSeguimiento: string;
  nombreApellido: string;
  telefono: string;
  fechaIngreso: Date;
  fechaSalida: Date;
  codigoSeguimiento: string;
  IMEI: string;
  pin: string;
  images: [string];
  estadoCobro: [string];
  precio: string;
  senado: Boolean;
  montoRestante: String;
  observaciones: String;
  instagram: String;
  email: String;
  primerDiagnostico?: IDiagnostico | null;
  segundoDiagnostico?: IDiagnostico | null;
  garantiaEquipo: String;
}

const diagnosticoSchema = new mongoose.Schema({
  tornillos: Boolean,
  botonPower: Boolean,
  carga: Boolean,
  botonHome: Boolean,
  touchFaceID: Boolean,
  trueTone: Boolean,
  flash: Boolean,
  camaraT1: Boolean,
  camaraT2: Boolean,
  camaraT3: Boolean,
  camaraFrontal: Boolean,
  giroscopio: Boolean,
  señal: Boolean,
  imei: Boolean,
  sensorProx: Boolean,
  parlanteInferior: Boolean,
  parlanteSuperior: Boolean,
  vibrador: Boolean,
  volumen: Boolean,
  condicionBat: Number,
  wifi: Boolean,
  microfono: Boolean,
  silencioSonido: Boolean,
  tactil: Boolean,
  fechaDiagnostico: {
    type: Date,
    required: true
  }
});

const registroSchema = new mongoose.Schema<IRegistro>({
  modelo: {
    type: String,
    required: true,
  },
  otros: {
    type: String,
    required: false,
  },
  motivoIngreso: {
    type: String,
    required: true,
  },
  detalles: {
    type: String,
    required: false,
  },
  precio: {
    type: String,
    required: false,
  },
  instagram: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  montoRestante: {
    type: String,
    required: false,
  },
  capacidad: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  montoSenado: {
    type: String,
    required: false,
  },
  senado: {
    type: Boolean,
    required: false,
  },
  metodoPago: {
    type: String,
    required: false,
  },
  estadoCobro: {
    type: [String], // Un arreglo de strings
    required: false,
  },
  DNI: {
    type: String,
    required: true,
  },
  estadoSeguimiento: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: false,
  },
  nombreApellido: {
    type: String,
    required: true,
  },
  telefono: {
    type: String,
    required: true,
  },
  fechaIngreso: {
    type: Date,
    required: true,
  },
  fechaSalida: {
    type: Date,
    required: false,
  },
  codigoSeguimiento: {
    type: String,
    required: true,
    unique: true,
    default: () => customAlphabetWithoutDashUnderscore(),
  },
  IMEI: {
    type: String,
    required: true,
  },
  pin: {
    type: String,
    required: false,
    default: "No tiene",
  },
  observaciones: {
    type: String,
    required: false,
  },
  primerDiagnostico: {
    type: diagnosticoSchema,
    required: false,
  },
  segundoDiagnostico: {
    type: diagnosticoSchema,
    required: false,
  },
  garantiaEquipo: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});


export const Registro: Model<IRegistro> =
  mongoose.models.Registro || mongoose.model<IRegistro>("Registro", registroSchema);

export const Diagnostico: Model<IDiagnostico> =
  mongoose.models.Diagnostico || mongoose.model<IDiagnostico>("Diagnostico", diagnosticoSchema);
