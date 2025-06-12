export interface User {
  id: string
  name: string
  email: string
  isAdmin?: boolean
}

export interface Category {
  id: string
  name: string
}

export interface Product {
  id: string
  name: string
  description: string
  imageUrl: string
  categoryId: string
  basePrice: number
  stock: number
  visitCount: number
}

export interface Visit {
  id?: string
  userId: string
  productId: string
  visitCount: number
}

export interface ProductWithCategory extends Product {
  category: Category
  adjustedPrice: number
}
