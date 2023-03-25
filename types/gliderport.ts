export type GLIDERPORT = {
  title: string
  description: string
  operationType: 'commercial' | 'club'
  coordinates: [number, number]
  id?: number
  website?: string
  image?: any
}
