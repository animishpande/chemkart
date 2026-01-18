import { Box, Container, Grid, Heading, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { ProductCard, type Product } from "./ProductCard"
import { orderApi } from "../services/api"
import { toaster } from "./ui/toaster"

const products: Product[] = [
  { name: "Sulfuric Acid", price: 1200, formula: "H₂SO₄" },
  { name: "Sodium Hydroxide", price: 800, formula: "NaOH" },
  { name: "Hydrochloric Acid", price: 950, formula: "HCl" },
  { name: "Ethanol", price: 600, formula: "C₂H₅OH" },
  { name: "Acetone", price: 700, formula: "C₃H₆O" },
]

export const MainContent = () => {
  const [cartItems, setCartItems] = useState<Set<string>>(new Set())
  const [isLoadingCart, setIsLoadingCart] = useState(true)

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    try {
      const orders = await orderApi.getAllOrders()
      const orderNames = new Set(orders.map(order => order.name))
      setCartItems(orderNames)
    } catch {
      toaster.create({
        title: "Error loading cart",
        description: "Failed to load your cart items",
        type: "error",
      })
    } finally {
      setIsLoadingCart(false)
    }
  }

  const handleAddToCart = async (product: Product) => {
    try {
      await orderApi.createOrder({ name: product.name, price: product.price })
      setCartItems(prev => new Set(prev).add(product.name))
      toaster.create({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
        type: "success",
      })
    } catch (error) {
      toaster.create({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add item to cart",
        type: "error",
      })
    }
  }

  const handleRemoveFromCart = async (productName: string) => {
    try {
      await orderApi.cancelOrder(productName)
      setCartItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(productName)
        return newSet
      })
      toaster.create({
        title: "Removed from cart",
        description: `${productName} has been removed from your cart`,
        type: "success",
      })
    } catch (error) {
      toaster.create({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove item from cart",
        type: "error",
      })
    }
  }

  if (isLoadingCart) {
    return (
      <Box as="main" flex="1" py={20} bg="gray.50">
        <Container maxW="7xl">
          <Text textAlign="center" color="gray.600">
            Loading products...
          </Text>
        </Container>
      </Box>
    )
  }

  return (
    <Box as="main" flex="1" py={12} bg="gray.50">
      <Container maxW="7xl">
        <Heading size="2xl" mb={2} color="gray.900" textAlign="center">
          Chemical Products
        </Heading>
        <Text color="gray.600" mb={8} textAlign="center">
          Select high-quality chemicals for your laboratory needs
        </Text>
        
        <Grid 
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} 
          gap={6}
        >
          {products.map((product) => (
            <ProductCard
              key={product.name}
              product={product}
              isInCart={cartItems.has(product.name)}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
            />
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
