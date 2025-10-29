import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Product name must be at least 2 characters'],
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },

    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9-]+$/,
        'Slug must contain only lowercase letters, numbers, and hyphens',
      ],
    },

    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },

    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },

    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
      maxlength: [50, 'Category cannot exceed 50 characters'],
    },

    inventory: {
      type: Number,
      required: [true, 'Inventory count is required'],
      min: [0, 'Inventory cannot be negative'],
      default: 0,
    },

    // ✅ Optional Product Image
    image: {
      type: String,
      required: false, // explicitly optional
      default: 'https://via.placeholder.com/400x300?text=Product+Image',
      validate: {
        validator: function (v) {
          if (!v) return true; // allow empty / optional
          try {
            new URL(v); // validate only if provided
            return true;
          } catch {
            return false;
          }
        },
        message: 'Image must be a valid URL',
      },
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

//
// 🔍 Indexes for performance
//
// ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ inventory: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ createdAt: -1 });

//
// 🕓 Middleware hooks
//
ProductSchema.pre('save', function (next) {
  this.lastUpdated = new Date();
  next();
});

ProductSchema.pre('findOneAndUpdate', function (next) {
  this.set({ lastUpdated: new Date() });
  next();
});

//
// 💡 Virtual properties
//
ProductSchema.virtual('stockStatus').get(function () {
  if (this.inventory === 0) return 'Out of Stock';
  if (this.inventory < 10) return 'Low Stock';
  return 'In Stock';
});

ProductSchema.virtual('isLowStock').get(function () {
  return this.inventory > 0 && this.inventory < 10;
});

//
// 🧩 Include virtuals in JSON outputs
//
ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });

//
// 🧠 Prevent overwrite in dev hot reload
//
export default mongoose.models.Product ||
  mongoose.model('Product', ProductSchema);
