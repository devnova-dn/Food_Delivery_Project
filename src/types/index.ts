// User Types
export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  avatar?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// Product Types
export interface IProduct {
  _id?: string;
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
  reviews: IReview[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IReview {
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

// Order Types
export interface IOrderItem {
  productId: string;
  title: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
}

export interface IShippingAddress {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface IOrder {
  _id?: string;
  userId: string;
  userEmail: string;
  orderItems: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: 'cod' | 'card';
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Cart Types
export interface ICartItem {
  id: string;
  productId: string;
  title: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  maxQuantity: number;
}

// Filter Types
export interface IProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  isOrganic?: boolean;
  sort?: 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'popular';
  search?: string;
}

// API Response Types
export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Admin Stats Types
export interface IAdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: IOrder[];
  topProducts: {
    productId: string;
    title: string;
    totalSold: number;
  }[];
  ordersByStatus: {
    status: string;
    count: number;
  }[];
  salesByMonth: {
    month: string;
    sales: number;
  }[];
}
