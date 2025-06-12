import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  increment,
} from "firebase/firestore"
import { db } from "./firebase"
import type { Category, Product, User } from "./types"

// Categories
export const getCategories = async (): Promise<Category[]> => {
  const snapshot = await getDocs(collection(db, "categories"))
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Category)
}

export const addCategory = async (category: Omit<Category, "id">): Promise<string> => {
  const docRef = await addDoc(collection(db, "categories"), category)
  return docRef.id
}

export const updateCategory = async (id: string, category: Partial<Category>): Promise<void> => {
  await updateDoc(doc(db, "categories", id), category)
}

export const deleteCategory = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "categories", id))
}

// Products
export const getProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(collection(db, "products"))
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Product)
}

export const getProduct = async (id: string): Promise<Product | null> => {
  const docSnap = await getDoc(doc(db, "products", id))
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Product
  }
  return null
}

export const addProduct = async (product: Omit<Product, "id">): Promise<string> => {
  const docRef = await addDoc(collection(db, "products"), product)
  return docRef.id
}

export const updateProduct = async (id: string, product: Partial<Product>): Promise<void> => {
  await updateDoc(doc(db, "products", id), product)
}

export const deleteProduct = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, "products", id))
}

// Search products
export const searchProducts = async (searchTerm: string, categoryId?: string): Promise<Product[]> => {
  let q = query(collection(db, "products"))

  if (categoryId) {
    q = query(q, where("categoryId", "==", categoryId))
  }

  const snapshot = await getDocs(q)
  const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Product)

  if (searchTerm) {
    return products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }

  return products
}

// Visits
export const getVisitCount = async (userId: string, productId: string): Promise<number> => {
  const q = query(collection(db, "visits"), where("userId", "==", userId), where("productId", "==", productId))
  const snapshot = await getDocs(q)

  if (snapshot.empty) {
    return 0
  }

  return snapshot.docs[0].data().visitCount || 0
}

export const incrementVisitCount = async (userId: string, productId: string): Promise<void> => {
  const q = query(collection(db, "visits"), where("userId", "==", userId), where("productId", "==", productId))
  const snapshot = await getDocs(q)

  if (snapshot.empty) {
    await addDoc(collection(db, "visits"), {
      userId,
      productId,
      visitCount: 1,
    })
  } else {
    const visitDoc = snapshot.docs[0]
    await updateDoc(visitDoc.ref, {
      visitCount: increment(1),
    })
  }
}

// Users
export const getUsers = async (): Promise<User[]> => {
  const snapshot = await getDocs(collection(db, "users"))
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as User)
}
