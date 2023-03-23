export type GLIDERPORT = {
  title: string
  description: string
  operationType: 'commercial' | 'club'
  category: 'gliderport'
  coordinates: [number, number]
  id?: number
}
