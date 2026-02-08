import mongoose from 'mongoose';

const promotionSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    image: { type: String, required: true }, // URL from Cloudinary
    link: { type: String, default: '/' },    // Where the button leads
    type: { 
      type: String, 
      required: true, 
      enum: ['Slider', 'Deal'], 
      default: 'Slider' 
    },
    isActive: { type: Boolean, required: true, default: true },
   expiresAt: { type: Date },
  },
  { timestamps: true }
);

const Promotion = mongoose.model('Promotion', promotionSchema);
export default Promotion;