import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  username: {
    String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  hash: {
    String,
    required: true,
    trim: true,
  },
  email: {
    String,
    required: true,
    unique: true,
    trim: true,
  },
  winsAsRunner: {
    Number,
    required: true,
    default: 0,
  },
  winsAsHunter: {
    Number,
    required: true,
    default: 0,
  },
  lossesAsRunner: {
    Number,
    required: true,
    default: 0,
  },
  lossesAsHunter: {
    Number,
    required: true,
    default: 0,
  }
}
);

export default mongoose.models.Users || mongoose.model('User', UserSchema);

