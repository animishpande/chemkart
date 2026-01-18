const API_BASE_URL = 'http://localhost:5200'

export interface Order {
  id: string
  name: string
  price: number
  deliveryDate: string
  status: number
}

export interface CreateOrderDTO {
  name: string
  price: number
}

export const orderApi = {
  getAllOrders: async (): Promise<Order[]> => {
    const response = await fetch(`${API_BASE_URL}/orders`)
    if (!response.ok) throw new Error('Failed to fetch orders')
    return response.json()
  },

  createOrder: async (order: CreateOrderDTO): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    })
    if (!response.ok) {
      const error = await response.text()
      throw new Error(error)
    }
    return response.json()
  },

  cancelOrder: async (name: string): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/orders/cancel/${encodeURIComponent(name)}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      const error = await response.text()
      throw new Error(error)
    }
    return response.json()
  },
}