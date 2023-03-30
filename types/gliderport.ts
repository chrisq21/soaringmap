export type GLIDERPORT = {
  title: string
  description: string
  operationType: 'commercial' | 'club'
  coordinates: [number, number]
  state: string
  city: string
  id?: number
  website?: string
  image?: any
  satelliteImage?: any
}
