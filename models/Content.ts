import mongoose, { Document } from 'mongoose';

export type SourceType = 'upload' | 'external_link';

export interface IContent extends Document {
  title: string;
  description: string;
  tags: string[];
  fileUrl: string;
  thumbnailUrl: string;
  fileType: 'image' | 'video' | 'pdf';
  sourceType: SourceType;
  publicId?: string;
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
    sourceType: { type: String, enum: ['upload', 'external_link'], required: true, default: 'upload' },
    publicId: {
  type: String,
  validate: {
    validator: function (value: string) {
      if (this.sourceType === 'upload') {
        return !!value;
      }
      return true;
    },
    message: 'publicId is required for uploaded files',
  },
},
 // Only required for uploaded files
    uploadedBy: { type: String, required: true, default: 'admin' },
  },
  { timestamps: true }
);

export default mongoose.models.Content || mongoose.model<IContent>('Content', contentSchema);
