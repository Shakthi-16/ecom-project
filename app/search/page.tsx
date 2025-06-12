"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { ProductCard } from "@/components/product-card"
import { searchProducts, getCategories } from "@/lib/db"
import type { Category, ProductWithCategory } from "@/lib/types"
import { Search, Filter } from "lucide-react"

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [products, setProducts] = useState<ProductWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    const loadCategories = async () => {
      const categoriesData = await getCategories()
      setCategories(categoriesData)
    }
    loadCategories()
  }, [])

  useEffect(() => {
    const searchWithFilters = async () => {
      setLoading(true)
      try {
        const results = await searchProducts(searchTerm, selectedCategory || undefined)
        const categoriesData = await getCategories()

        let filteredResults = results.map((product) => {
          const category = categoriesData.find((cat) => cat.id === product.categoryId)
          return {
            ...product,
            category: category || { id: "", name: "Unknown" },
            adjustedPrice: product.basePrice,
          }
        })

        // Apply price filter
        filteredResults = filteredResults.filter(
          (product) => product.basePrice >= priceRange[0] && product.basePrice <= priceRange[1],
        )

        // Apply stock filter
        if (inStockOnly) {
          filteredResults = filteredResults.filter((product) => product.stock > 0)
        }

        setProducts(filteredResults)
      } catch (error) {
        console.error("Error searching products:", error)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchWithFilters, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm, selectedCategory, priceRange, inStockOnly])

  useEffect(() => {
    // Generate suggestions based on search term
    if (searchTerm.length > 0) {
      const filtered = products
        .filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((product) => product.name)
        .slice(0, 5)
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }, [searchTerm, products])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Search Products</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Search and Filters */}
          <div className="lg:col-span-1 space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg z-10 mt-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                      onClick={() => {
                        setSearchTerm(suggestion)
                        setSuggestions([])
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </h3>

              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <Slider value={priceRange} onValueChange={setPriceRange} max={1000} step={10} className="mt-2" />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="inStock" checked={inStockOnly} onCheckedChange={setInStockOnly} />
                <label htmlFor="inStock" className="text-sm font-medium">
                  In stock only
                </label>
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("")
                  setPriceRange([0, 1000])
                  setInStockOnly(false)
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80" />
                ))}
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-muted-foreground">
                    {products.length} product{products.length !== 1 ? "s" : ""} found
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {products.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No products found matching your criteria</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
