import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'user' | 'admin';
export type UserStatus = 'active' | 'suspended';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['user', 'admin'], 
      default: 'user', 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['active', 'suspended'], 
      default: 'active',
      required: true 
    },
  },
  { 
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        const { _id, __v, password, ...rest } = ret;
        return {
          id: _id.toString(),
          ...rest
        };
      }
    }
  }
);

// Check if the model already exists before compiling it
const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
