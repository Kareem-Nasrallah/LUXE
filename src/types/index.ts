export interface Product {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description: string;
  image: {
    asset: {
      _ref: string;
    };
  };
  price: number;
  oldPrice?: number;
  onSale: boolean;
  category: Category;
  rating: number;
  stock: number;
  isNew?: boolean;
}

export interface Category {
  _id: string;
  title: string;
  description: string;
  slug: {
    current: string;
  };
  image: {
    asset: {
      _ref: string;
    };
  };
  productCount?: number;
}

export interface Review {
  _id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface Order {
  orderNumber: string;
  user: User;
  items: CartItem[];
  total: number;
  state: "pending" | "processing" | "shipped" | "delivered";
  shippingInfo: ShippingInfo;
  userSnapshot: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface ShippingInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  phone: string;
}

export interface Offer {
  id: string;
  productIds: string[];
  discountPercent: number;
  expiresAt: string;
  createdAt: string;
  isActive: boolean;
}
