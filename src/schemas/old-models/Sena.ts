import mongoose, { Document, Model } from "mongoose";
import { customAlphabet } from "nanoid";

export type SortOrder = -1 | 1;

// Custom alphabet excluding "-" and "_"
const customAlphabetWithoutDashUnderscore = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  11
);
export interface ISena extends Document {
  modelo: string;
  otros: string;
  color: string;
  capacidad: string;
  montoSenado: string;
  DNI: string;
  nombreApellido: string;
  telefono: string;
  estadoSeguimiento: string;
  fechaIngreso: Date;
  codigoSeguimiento: string;
  precio: string;
  montoRestante: String;
  observaciones: String;
  email: String;
}

const senaSchema = new mongoose.Schema<ISena>(
  {
    modelo: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: false,
    },
    otros:{
      type: String,
      required: false,
    },
    capacidad: {
      type: String,
      required: false,
    },
    precio: {
      type: String,
      required: true,
    },
    montoSenado: {
      type: String,
      required: false,
    },
    montoRestante: {
      type: String,
      required: false,
    },
    nombreApellido: {
      type: String,
      required: true,
    },
    DNI: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    telefono: {
      type: String,
      required: true,
    },
    fechaIngreso: {
      type: Date,
      required: true,
    },
    estadoSeguimiento: {
      type: String,
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
  },
  {
    timestamps: true,
  }
);

export const Sena: Model<ISena> =
  mongoose.models.Sena || mongoose.model<ISena>("Sena", senaSchema);
