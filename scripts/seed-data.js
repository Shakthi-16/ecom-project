// Seed data script for Firebase Firestore
// Run this script to populate your database with sample data

import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBi6-2doqKRVHd5pgavTZGLk5vSrl4V9Fg",
  authDomain: "ecommerce-app-e26e8.firebaseapp.com",
  projectId: "ecommerce-app-e26e8",
  storageBucket: "ecommerce-app-e26e8.firebasestorage.app",
  messagingSenderId: "804733503686",
  appId: "1:804733503686:web:4b273ee643fd39d057afc7",
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Sample categories
const categories = [
  { name: "Electronics" },
  { name: "Clothing" },
  { name: "Books" },
  { name: "Home & Garden" },
  { name: "Sports" },
]

// Sample products
const products = [
  {
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    basePrice: 199.99,
    stock: 50,
    visitCount: 0,
  },
  {
    name: "Smart Watch",
    description: "Feature-rich smartwatch with health tracking",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    basePrice: 299.99,
    stock: 30,
    visitCount: 0,
  },
  {
    name: "Cotton T-Shirt",
    description: "Comfortable 100% cotton t-shirt in various colors",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    basePrice: 24.99,
    stock: 100,
    visitCount: 0,
  },
  {
    name: "Running Shoes",
    description: "Lightweight running shoes for optimal performance",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    basePrice: 129.99,
    stock: 75,
    visitCount: 0,
  },
  {
    name: "Programming Book",
    description: "Learn modern web development with this comprehensive guide",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500",
    basePrice: 49.99,
    stock: 25,
    visitCount: 0,
  },
]

// Admin user (you'll need to create this user first through the UI)
const adminUser = {
  name: "Admin User",
  email: "admin@example.com",
  isAdmin: true,
}

async function seedData() {
  try {
    console.log("Starting to seed data...")

    // Add categories
    console.log("Adding categories...")
    const categoryIds = []
    for (const category of categories) {
      const docRef = await addDoc(collection(db, "categories"), category)
      categoryIds.push(docRef.id)
      console.log(`Added category: ${category.name}`)
    }

    // Add products with category references
    console.log("Adding products...")
    for (let i = 0; i < products.length; i++) {
      const product = {
        ...products[i],
        categoryId: categoryIds[i % categoryIds.length],
      }
      await addDoc(collection(db, "products"), product)
      console.log(`Added product: ${product.name}`)
    }

    console.log("Data seeding completed successfully!")
    console.log(
      "Note: Remember to create an admin user through the registration form and then manually update their isAdmin field to true in Firestore.",
    )
  } catch (error) {
    console.error("Error seeding data:", error)
  }
}

seedData()
