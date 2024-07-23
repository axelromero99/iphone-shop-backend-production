import * as mongoose from 'mongoose';

interface PaymentMethod {
    type: 'mercadopago_checkout_pro';
    details: {
        state: string;
    };
}

export interface UserDocument extends mongoose.Document {
    email: string;
    password: string;
    fullName: string;
    isActive: boolean;
    paymentMethods: PaymentMethod[];
    roles: string[];
    passwordResetCode: string;
    passwordResetExpiry: Date;
    establishment: mongoose.Schema.Types.ObjectId;
}

export const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    fullName: {
        type: String,
        required: true
    },
    roles: {
        type: [String],
        enum: ['admin', 'vendedor', 'tecnico', 'cliente'],
        default: ['tecnico']
    },
    passwordResetCode: {
        type: String,
        select: false
    },
    passwordResetExpiry: {
        type: Date,
        select: false
    },
}, {
    timestamps: true
});

UserSchema.pre('save', function (next) {
    this.email = this.email.toLowerCase().trim();
    next();
});

UserSchema.virtual('products', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'user'
});

export const User = mongoose.model<UserDocument>('User', UserSchema);
export const UserSchemaName = 'User';
