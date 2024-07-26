import * as mongoose from 'mongoose';


export interface UserDocument extends mongoose.Document {
    email: string;
    password: string;
    fullName: string;
    isActive: boolean;
    roles: string[];
    passwordResetCode: string;
    passwordResetExpiry: Date;
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
    isActive: {
        type: Boolean,
        default: true
    },
    roles: {
        type: [String],
        enum: ['admin', 'vendedor', 'tecnico'],
        default: ['tecnico'],
        required: true
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

export const User = mongoose.model<UserDocument>('User', UserSchema);
export const UserSchemaName = 'User';
