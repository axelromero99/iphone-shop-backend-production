import mongoose, { Document, Model } from "mongoose";
import { customAlphabet } from 'nanoid';

export type SortOrder = -1 | 1;

// Custom alphabet excluding "-" and "_"
const customAlphabetWithoutDashUnderscore = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 11);
export interface IVenta extends Document {
  modelo: string;
  color: string;
  capacidad: string;
  montoSenado: string;
  metodoPago: string;
  DNI: string;
  comprobantePago: string;
  nombreApellido: string;
  telefono: string;
  estado: string;
  estadoSeguimiento: string;
  fechaIngreso: Date;
  codigoSeguimiento: string;
  IMEI: string;
  precio: string;
  senado: Boolean;
  montoRestante: String;
  observaciones: String;
  direccion: String;
  email: String;
  recibiPesos: Number;
  recibiDolares: Number;
  recibiEquipo: Number;
}

const ventaSchema = new mongoose.Schema<IVenta>({
  modelo: {
    type: String,
    required: true,
  },
  direccion: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    required: true,
  },
  capacidad: {
    type: String,
    required: true,
  },
  montoSenado: {
    type: String,
    required: false,
  },
  metodoPago: {
    type: String,
    required: false,
  },
  DNI: {
    type: String,
    required: true,
  },
  comprobantePago: {
    type: String,
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
  observaciones: {
    type: String,
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
    required: false,
  },
  estado: {
    type: String,
    required: true,
  },
  estadoSeguimiento: {
    type: String,
    required: true,
  },
  precio: {
    type: String,
    required: true,
  },
  senado: {
    type: Boolean,
    required: false,
  },
  montoRestante: {
    type: String,
    required: false,
  },
  recibiPesos: {
    type: Number,
    required: false,
  },
  recibiDolares: {
    type: Number,
    required: false,
  },
  recibiEquipo: {
    type: String,
    required: false,
  },
}, {
  timestamps: true
});

export const Venta: Model<IVenta> = mongoose.models.Venta || mongoose.model<IVenta>("Venta", ventaSchema);
