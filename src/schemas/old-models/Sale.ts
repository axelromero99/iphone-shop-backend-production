import mongoose, { Document, Model } from "mongoose";
import { customAlphabet } from 'nanoid';

export type SortOrder = -1 | 1;

// Custom alphabet excluding "-" and "_"
const customAlphabetWithoutDashUnderscore = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 11);

// export interface ISale extends any {
//     model: string;
//     color: string;
//     capacity: string;
//     downPaymentAmount: string;
//     paymentMethod: string;
//     IDNumber: string;
//     paymentReceipt: string;
//     fullName: string;
//     phone: string;
//     status: string;
//     trackingStatus: string;
//     entryDate: Date;
//     trackingCode: string;
//     IMEI: string;
//     price: string;
//     isDownPaymentMade: Boolean;
//     remainingAmount: String;
//     observations: String;
//     address: String;
//     email: String;
//     receivedPesos: Number;
//     receivedDollars: Number;
//     receivedEquipment: Number;
// }

const saleSchema = new mongoose.Schema<any>({
    model: {
        type: String,
        required: true,
    },
    address: {
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
    capacity: {
        type: String,
        required: true,
    },
    downPaymentAmount: {
        type: String,
        required: false,
    },
    paymentMethod: {
        type: String,
        required: false,
    },
    IDNumber: {
        type: String,
        required: true,
    },
    paymentReceipt: {
        type: String,
        required: false,
    },
    fullName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    entryDate: {
        type: Date,
        required: true,
    },
    observations: {
        type: String,
        required: false,
    },
    trackingCode: {
        type: String,
        required: true,
        unique: true,
        default: () => customAlphabetWithoutDashUnderscore(),
    },
    IMEI: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: true,
    },
    trackingStatus: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    isDownPaymentMade: {
        type: Boolean,
        required: false,
    },
    remainingAmount: {
        type: String,
        required: false,
    },
    receivedPesos: {
        type: Number,
        required: false,
    },
    receivedDollars: {
        type: Number,
        required: false,
    },
    receivedEquipment: {
        type: String,
        required: false,
    },
}, {
    timestamps: true
});

export const Sale: Model<any> = mongoose.models.Sale || mongoose.model<any>("Sale", saleSchema);