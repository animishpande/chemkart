import { Box, Container, Text } from "@chakra-ui/react"

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <Box
      as="footer"
      bg="white"
      borderTopWidth="1px"
      borderTopColor="gray.200"
      py={6}
      mt="auto"
    >
      <Container maxW="7xl">
        <Text textAlign="center" fontSize="sm" color="gray.600">
          © {currentYear} ChemKart. All rights reserved.
        </Text>
      </Container>
    </Box>
  )
}
