import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProductDocument extends Document {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  brand: string;
  stock: number;
  unit: string;
  ingredients?: string[];
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    fiber: number;
  };
  allergens?: string[];
  isOrganic: boolean;
  isFeatured: boolean;
  rating: number;
  numReviews: number;
  reviews: {
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema(
  {
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProductDocument>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a product title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
    },
    shortDescription: {
      type: String,
      required: [true, 'Please provide a short description'],
      maxlength: [300, 'Short description cannot be more than 300 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price cannot be negative'],
    },
    discountPrice: {
      type: Number,
      min: [0, 'Discount price cannot be negative'],
      validate: {
        validator: function (this: IProductDocument, value: number) {
          return value < this.price;
        },
        message: 'Discount price must be less than regular price',
      },
    },
    images: {
      type: [String],
      default: ['/placeholder-food.jpg'],
      validate: {
        validator: function (v: string[]) {
          return v.length <= 10;
        },
        message: 'Cannot have more than 10 images',
      },
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: [
        'fresh-produce',
        'dairy-eggs',
        'meat-seafood',
        'bakery',
        'frozen-foods',
        'beverages',
        'snacks',
        'pantry',
        'organic',
        'international',
      ],
    },
    subcategory: {
      type: String,
      default: '',
    },
    brand: {
      type: String,
      required: [true, 'Please provide a brand'],
      default: 'GourmetHub',
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    unit: {
      type: String,
      required: true,
      enum: ['kg', 'g', 'lb', 'oz', 'L', 'ml', 'piece', 'pack', 'box', 'bottle'],
      default: 'piece',
    },
    ingredients: {
      type: [String],
      default: [],
    },
    nutritionalInfo: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbohydrates: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      fiber: { type: Number, default: 0 },
    },
    allergens: {
      type: [String],
      default: [],
      enum: ['gluten', 'dairy', 'nuts', 'soy', 'eggs', 'fish', 'shellfish', 'sesame'],
    },
    isOrganic: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    reviews: {
      type: [ReviewSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Create slug from title before saving
ProductSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Index for search and filtering
ProductSchema.index({ title: 'text', description: 'text', brand: 'text' });
ProductSchema.index({ category: 1, slug: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ rating: -1 });
ProductSchema.index({ createdAt: -1 });

const Product: Model<IProductDocument> =
  mongoose.models.Product || mongoose.model<IProductDocument>('Product', ProductSchema);

export default Product;
