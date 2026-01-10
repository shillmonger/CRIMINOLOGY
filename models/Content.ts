import mongoose, { Document } from 'mongoose';

export interface IContent extends Document {
  title: string;
  description: string;
  tags: string[];
  fileUrl: string;
  thumbnailUrl: string;
  fileType: 'image' | 'video' | 'pdf';
  publicId: string;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const contentSchema = new mongoose.Schema<IContent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
    fileUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    fileType: { type: String, enum: ['image', 'video', 'pdf'], required: true },
    publicId: { type: String, required: true },
    uploadedBy: { type: String, required: true, default: 'admin' },
  },
  { timestamps: true }
);

export default mongoose.models.Content || mongoose.model<IContent>('Content', contentSchema);
