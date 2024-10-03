import mongoose, { Schema, Document } from 'mongoose'

interface IUser extends Document {
    username: string
    email: string
    password: string
}

const UserSchema: Schema = new Schema({
    uid: { type: String, unique: true },
    name: { type: String }
});

// Exporter le modèle
export default mongoose.model<IUser>('User', UserSchema)
