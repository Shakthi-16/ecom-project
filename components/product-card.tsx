"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ProductWithCategory } from "@/lib/types"
import { calculateDynamicPrice } from "@/lib/pricing"
import { useAuth } from "@/contexts/auth-context"

interface ProductCardProps {
  product: ProductWithCategory
}

export function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth()
  const [dynamicPrice, setDynamicPrice] = useState(product.basePrice)

  useEffect(() => {
    const loadPrice = async () => {
      const userId = user?.id || "guest"
      const price = await calculateDynamicPrice(product.basePrice, userId, product.id)
      setDynamicPrice(price)
    }

    loadPrice()
  }, [product.basePrice, product.id, user?.id])

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square relative">
          <Image
            src={product.imageUrl || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
          <Badge variant="secondary" className="mb-2">
            {product.category.name}
          </Badge>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-lg font-bold">₹{dynamicPrice.toFixed(2)}</span>
            {dynamicPrice !== product.basePrice && (
              <span className="text-sm text-muted-foreground line-through">₹{product.basePrice.toFixed(2)}</span>
            )}
          </div>
          <Badge variant={product.stock > 0 ? "default" : "destructive"}>
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </Badge>
        </CardFooter>
      </Link>
    </Card>
  )
}
