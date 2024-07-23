import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUserSchema extends Document {
    email: string;
    password: string;
    type: string;
}

const UserSchema: Schema<IUserSchema> = new Schema<IUserSchema>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    type: { type: String, required: true },
});

// Pre-save hook to hash the password before saving the user document
UserSchema.pre<IUserSchema>('save', async function (next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
});


const User: Model<IUserSchema> = mongoose.models.User || mongoose.model<IUserSchema>('User', UserSchema);

export default User;
