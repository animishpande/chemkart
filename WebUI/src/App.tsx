import './App.css'
import { Box } from "@chakra-ui/react"
import { Header } from "./components/Header"
import { MainContent } from "./components/MainContent"
import { Footer } from "./components/Footer"
import { Toaster } from "./components/ui/toaster"

function App() {
  return (
    <Box display="flex" flexDirection="column" minH="100vh" bg="gray.50">
      <Header />
      <MainContent />
      <Footer />
      <Toaster />
    </Box>
  )
}

export default App
