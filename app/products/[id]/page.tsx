"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getProduct, getCategories, incrementVisitCount } from "@/lib/db"
import { calculateDynamicPrice, trackGuestVisit } from "@/lib/pricing"
import type { Product, Category } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ProductPage() {
  const params = useParams()
  const { user } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [dynamicPrice, setDynamicPrice] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProduct = async () => {
      if (!params.id || typeof params.id !== "string") return

      try {
        const [productData, categoriesData] = await Promise.all([getProduct(params.id), getCategories()])

        if (productData) {
          setProduct(productData)
          const productCategory = categoriesData.find((cat) => cat.id === productData.categoryId)
          setCategory(productCategory || null)

          // Track visit
          const userId = user?.id || "guest"
          if (userId === "guest") {
            trackGuestVisit(productData.id)
          } else {
            await incrementVisitCount(userId, productData.id)
          }

          // Calculate dynamic price
          const price = await calculateDynamicPrice(productData.basePrice, userId, productData.id)
          setDynamicPrice(price)
        }
      } catch (error) {
        console.error("Error loading product:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [params.id, user?.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-96 rounded-lg mb-6" />
          <div className="bg-gray-200 h-8 w-3/4 rounded mb-4" />
          <div className="bg-gray-200 h-4 w-1/2 rounded mb-2" />
          <div className="bg-gray-200 h-4 w-1/4 rounded" />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center mb-6 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="aspect-square relative">
          <Image
            src={product.imageUrl || "/placeholder.svg?height=600&width=600"}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            {category && (
              <Badge variant="secondary" className="mb-4">
                {category.name}
              </Badge>
            )}
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">₹{dynamicPrice.toFixed(2)}</span>
                  {dynamicPrice !== product.basePrice && (
                    <span className="text-lg text-muted-foreground line-through">₹{product.basePrice.toFixed(2)}</span>
                  )}
                </div>

                {dynamicPrice !== product.basePrice && (
                  <p className="text-sm text-muted-foreground">Price adjusted based on your viewing history</p>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Stock:</span>
                  <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                    {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
                  </Badge>
                </div>

                <Button className="w-full" disabled={product.stock === 0} size="lg">
                  {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
