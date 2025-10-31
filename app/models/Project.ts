import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    technologies: string[];
    url?: string;
    github?: string;
    startDate: Date;
    endDate?: Date;
}

const projectSchema = new Schema<IProject>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    technologies: [{ type: String }],
    url: String,
    github: String,
    startDate: { type: Date, required: true },
    endDate: Date
}, { timestamps: true });

export default mongoose.model<IProject>('Project', projectSchema);
