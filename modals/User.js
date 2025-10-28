import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true },
  sex: { type: String, required: true },
  disease: { type: String, required: true },
  address: { type: String, required: true }, 
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);
