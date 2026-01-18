import { Box, Button, Text, VStack } from "@chakra-ui/react"
import { useState } from "react"

export interface Product {
  name: string
  price: number
  formula?: string
}

interface ProductCardProps {
  product: Product
  isInCart: boolean
  onAddToCart: (product: Product) => void
  onRemoveFromCart: (productName: string) => void
}

export const ProductCard = ({ 
  product, 
  isInCart, 
  onAddToCart, 
  onRemoveFromCart 
}: ProductCardProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    try {
      if (isInCart) {
        await onRemoveFromCart(product.name)
      } else {
        await onAddToCart(product)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius="lg"
      p={6}
      bg="white"
      boxShadow="sm"
      _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
      transition="all 0.2s"
    >
      <VStack align="stretch" gap={4}>
        <Box>
          <Text fontSize="xl" fontWeight="semibold" color="gray.900">
            {product.name}
          </Text>
          {product.formula && (
            <Text fontSize="sm" color="gray.500" mt={1}>
              {product.formula}
            </Text>
          )}
        </Box>
        
        <Text fontSize="2xl" fontWeight="bold" color="blue.600">
          ₹{product.price}
        </Text>

        <Button
          colorScheme={isInCart ? "red" : "blue"}
          variant={isInCart ? "outline" : "solid"}
          size="md"
          onClick={handleClick}
          loading={isLoading}
          width="full"
        >
          {isInCart ? "Remove from Cart" : "Add to Cart"}
        </Button>
      </VStack>
    </Box>
  )
}