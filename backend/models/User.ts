import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
    username: {
        String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    password: {
        String,
        required: true,
        trim: true,
        minlength: 3,
    },
    
}, {
    timestamps: true,
});

export default mongoose.models.Users || mongoose.model('User', UserSchema);

