import mongoose, { Document, Schema } from 'mongoose';

export interface IEducation extends Document {
    userId: mongoose.Types.ObjectId;
    school: string;
    degree: string;
    field: string;
    startDate: Date;
    endDate?: Date;
    description?: string;
}

const educationSchema = new Schema<IEducation>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    school: { type: String, required: true },
    degree: { type: String, required: true },
    field: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: Date,
    description: String
}, { timestamps: true });

export default mongoose.model<IEducation>('Education', educationSchema);
