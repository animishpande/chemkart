import { Box, Flex, Heading, IconButton } from "@chakra-ui/react"
import { LuUser } from "react-icons/lu"

export const Header = () => {
  return (
    <Box
      as="header"
      bg="white"
      borderBottomWidth="1px"
      borderBottomColor="gray.200"
      px={8}
      py={4}
    >
      <Flex justify="space-between" align="center" maxW="7xl" mx="auto">
        <Heading size="xl" fontWeight="semibold" color="gray.900" letterSpacing="tight">
          ChemKart
        </Heading>
        <IconButton
          aria-label="Login/Logout"
          variant="ghost"
          colorScheme="gray"
          size="lg"
          rounded="full"
          _hover={{ bg: "gray.100" }}
        >
          <LuUser />
        </IconButton>
      </Flex>
    </Box>
  )
}
