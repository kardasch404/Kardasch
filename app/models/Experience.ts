import mongoose, { Document, Schema } from 'mongoose';

export interface IExperience extends Document {
    userId: mongoose.Types.ObjectId;
    company: string;
    position: string;
    startDate: Date;
    endDate?: Date;
    description?: string;
}

const experienceSchema = new Schema<IExperience>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: String, required: true },
    position: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: Date,
    description: String
}, { timestamps: true });

export default mongoose.model<IExperience>('Experience', experienceSchema);
