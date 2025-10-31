import mongoose, { Document, Schema } from 'mongoose';

export interface ICompetence extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    level: number;
    category: string;
}

const competenceSchema = new Schema<ICompetence>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    level: { type: Number, required: true, min: 1, max: 5 },
    category: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<ICompetence>('Competence', competenceSchema);
