export interface Location {
  latitude: number
  longitude: number
  name: string
  address: string
}

export interface Trip {
  tripId: string
  startLocation: Location
  endLocation: Location
  startTime: string
  endTime: string
  distance: number
  duration: number
  riskScore: number
}