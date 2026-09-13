// =====================================================================
// TYPE DEFINITIONS — shared across UI and API
// =====================================================================

export type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;
  price: number;
  salePrice: number | null;
  currency: string;
  thumbnail: string;
  images: string[];
  categoryId: string;
  category?: Category;
  brandId: string | null;
  brand?: Brand | null;
  sizes: string[];
  colors: string[];
  stock: number;
  tags: string[];
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  rating: number;
  reviewCount: number;
  specifications: Record<string, string> | null;
  shippingInfo: string | null;
  createdAt: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
};

export type Review = {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string | null;
  comment: string;
  verified: boolean;
  createdAt: string;
};

// --- Cart ---
export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;       // effective unit price (sale or regular)
  regularPrice: number;
  quantity: number;
  size?: string;
  color?: string;
  sku: string;
  stock: number;
};

// --- Checkout / Orders ---
export type CustomerInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type ShippingInfo = {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  deliveryInstructions?: string;
};

export type OrderInput = {
  customer: CustomerInfo;
  shipping: ShippingInfo;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  paymentMethod: "stripe" | "paystack" | "flutterwave" | "cod";
  paymentReference?: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  deliveryInstructions: string | null;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentReference: string | null;
  orderStatus: string;
  items: OrderItemSnapshot[];
  createdAt: string;
};

export type OrderItemSnapshot = {
  productId: string;
  name: string;
  slug: string;
  sku: string;
  image: string;
  price: number;
  quantity: number;
  size: string | null;
  color: string | null;
};

// --- API responses ---
export type ApiResponse<T> =
  | { ok: true; data: T; error?: never }
  | { ok: false; error: string; data?: never };
