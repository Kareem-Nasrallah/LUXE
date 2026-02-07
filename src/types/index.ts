export interface Product {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description: string;
  image: string;
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
  slug: {
    current: string;
  };
  image: string;
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
  isAdmin?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered";
  shippingInfo: ShippingInfo;
  createdAt: string;
}

export interface ShippingInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  phone: string;
}
