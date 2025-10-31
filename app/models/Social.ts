import mongoose, { Document, Schema } from 'mongoose';

export interface ISocial extends Document {
    userId: mongoose.Types.ObjectId;
    platform: string;
    url: string;
}

const socialSchema = new Schema<ISocial>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    platform: { type: String, required: true },
    url: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<ISocial>('Social', socialSchema);
