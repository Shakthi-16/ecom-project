"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { getProducts, getCategories } from "@/lib/db"
import type { Category, ProductWithCategory } from "@/lib/types"

export default function HomePage() {
  const [products, setProducts] = useState<ProductWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([getProducts(), getCategories()])

        const productsWithCategories = productsData.map((product) => {
          const category = categoriesData.find((cat) => cat.id === product.categoryId)
          return {
            ...product,
            category: category || { id: "", name: "Unknown" },
            adjustedPrice: product.basePrice,
          }
        })

        setProducts(productsWithCategories)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Featured Products</h1>
        <p className="text-muted-foreground">Discover our latest collection</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products available</p>
        </div>
      )}
    </div>
  )
}
