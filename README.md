# GourmetHub - Premium Food E-Commerce Platform

A comprehensive, production-ready e-commerce website for food products built with Next.js 14, MongoDB Atlas, and Tailwind CSS. This application includes a full-featured customer interface and a powerful admin dashboard.

![GourmetHub](https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80)

## 🛒 Features

### Customer Features
- **Homepage**: Hero carousel, featured products, categories, promotions
- **Product Catalog**: Grid/list view, advanced filtering, search functionality
- **Product Details**: Image gallery, descriptions, nutritional info, reviews
- **Shopping Cart**: Persistent cart, quantity management, real-time totals
- **Checkout**: Multi-step checkout with Cash on Delivery payment
- **User Account**: Order history, profile management, address book
- **Authentication**: Secure signup/login with NextAuth.js

### Admin Features
- **Dashboard**: Sales overview, statistics, recent orders
- **Product Management**: Full CRUD operations, inventory control
- **Order Management**: View/track orders, update status
- **Category Management**: Organize products by categories
- **Sales Analytics**: Revenue tracking, top products, order stats

### Technical Features
- **Server Actions**: Modern Next.js data mutations
- **MongoDB Atlas**: Scalable cloud database
- **Responsive Design**: Mobile-first, all screen sizes
- **Performance Optimized**: Server-side rendering, image optimization
- **Type Safety**: Full TypeScript implementation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account
- Vercel account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/gourmethub.git
cd Gourmethub
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

4. **Configure your environment variables**
```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gourmethub?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here-generate-with-openssl-rand-base64-32

# Admin Credentials (seed this in database)
ADMIN_EMAIL=admin@gourmethub.com
ADMIN_PASSWORD=admin123
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
gourmethub/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (shop)/            # Customer-facing pages
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── api/               # API routes
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── actions/               # Server actions
│   │   ├── auth.ts            # Authentication actions
│   │   ├── product.ts         # Product actions
│   │   └── order.ts           # Order actions
│   ├── components/            # React components
│   │   ├── layout/            # Layout components
│   │   ├── shop/              # Shop components
│   │   └── ui/                # UI primitives
│   ├── context/               # State management
│   ├── lib/                   # Utilities
│   │   ├── auth.ts            # Auth configuration
│   │   ├── db.ts              # Database connection
│   │   └── utils.ts           # Helper functions
│   ├── models/                # MongoDB models
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   └── Order.ts
│   └── types/                 # TypeScript types
├── public/                    # Static assets
├── .env.example               # Environment template
├── next.config.js             # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
└── package.json
```

## 🗄️ Database Schema

### User Model
```typescript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'user' | 'admin',
  avatar: String,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model
```typescript
{
  title: String,
  slug: String (unique),
  description: String,
  shortDescription: String,
  price: Number,
  discountPrice: Number,
  images: [String],
  category: String,
  brand: String,
  stock: Number,
  unit: String,
  isOrganic: Boolean,
  isFeatured: Boolean,
  rating: Number,
  numReviews: Number,
  reviews: [{
    userId: String,
    userName: String,
    rating: Number,
    comment: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```typescript
{
  userId: String,
  userEmail: String,
  orderItems: [{
    productId: String,
    title: String,
    slug: String,
    image: String,
    price: Number,
    quantity: Number
  }],
  shippingAddress: {
    firstName: String,
    lastName: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String
  },
  paymentMethod: 'cod',
  itemsPrice: Number,
  shippingPrice: Number,
  totalPrice: Number,
  isPaid: Boolean,
  isDelivered: Boolean,
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Setting Up Admin User

1. Create a new account through the registration page
2. Access your MongoDB Atlas database
3. Update your user document to set role to 'admin':

```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

Or create an admin directly:

```javascript
db.users.insertOne({
  name: "Admin",
  email: "admin@gourmethub.com",
  password: "$2b$12$hash_generated_from_bcrypt",
  role: "admin",
  createdAt: new Date()
})
```

## 📦 Deployment to Vercel

### Step 1: Prepare Your Repository

1. Push your code to GitHub:
```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/gourmethub.git
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure the following settings:

**Project Settings:**
- Framework Preset: Next.js
- Build Command: `next build`
- Output Directory: `.next`

### Step 3: Configure Environment Variables

In Vercel project settings, add the following environment variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gourmethub?retryWrites=true&w=majority
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=your-super-secret-key-here-generate-with-openssl-rand-base64-32
```

**Important:** Generate your NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your site will be live at `https://your-project.vercel.app`

### Step 5: Configure MongoDB Atlas Network Access

1. Go to MongoDB Atlas → Network Access
2. Add IP address `0.0.0.0/0` (allows all IPs) or add Vercel's IP ranges
3. Alternatively, use a VPC peering for production

## 🔧 Configuration Options

### Customizing Categories

Edit `src/lib/utils.ts`:
```typescript
export const categories = [
  { id: 'fresh-produce', name: 'Fresh Produce', icon: '🥬' },
  { id: 'dairy-eggs', name: 'Dairy & Eggs', icon: '🥛' },
  // Add more categories
];
```

### Styling Customization

Modify `tailwind.config.ts`:
```typescript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#your-color', // Customize primary color
      },
    },
  },
}
```

### Image Upload (Optional)

For production image uploads, integrate Cloudinary:

1. Create Cloudinary account
2. Add credentials to `.env.local`:
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🔒 Security Considerations

- All passwords are hashed using bcrypt
- NextAuth.js handles session management
- API routes are protected with authentication
- Admin routes require admin role
- Environment variables are encrypted on Vercel

## 📈 Performance Optimization

- **Server Components**: Reduced client-side JavaScript
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic per-route bundles
- **Static Generation**: Where applicable
- **Caching**: Via Next.js Data Cache

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Run e2e tests
npm test:e2e
```

## 📝 API Documentation

### Products API
```
GET    /api/products          # List products with filters
GET    /api/products/[id]     # Get single product
POST   /api/products          # Create product (admin)
PUT    /api/products/[id]     # Update product (admin)
DELETE /api/products/[id]     # Delete product (admin)
```

### Orders API
```
GET    /api/orders            # List orders
GET    /api/orders/[id]       # Get single order
POST   /api/orders            # Create order
PUT    /api/orders/[id]       # Update order (admin)
```

## 🚀 Production Checklist

- [ ] Set up custom domain
- [ ] Configure SSL certificate
- [ ] Set up monitoring and analytics
- [ ] Configure error tracking (Sentry)
- [ ] Set up automated backups
- [ ] Load testing
- [ ] Security audit
- [ ] Performance audit

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

Built with ❤️ by [MiniMax Agent]
# Food_Delivery_Project
