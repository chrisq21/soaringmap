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
  ssaUrl?: string
}

// https://ddb.glidernet.org/download/?jRequest={"devices":{"live":[{"upload_id":"_ALL_","includeGround":true}]},"points":{"maxage":600,"wnd":"LAST"},"area":{"maxAlt":20000,"minAlt":0,"minAGL":0,"maxSpeed":1000,"minSpeed":5,"p1":{"lat":51.4795,"lon":-2.6083},"radius":50}}'

const i = {
  devices: {live: [{upload_id: '_ALL_', includeGround: true}]},
  points: {maxage: 600, wnd: 'LAST'},
  area: {maxAlt: 20000, minAlt: 0, minAGL: 0, maxSpeed: 1000, minSpeed: 5, p1: {lat: 51.4795, lon: -2.6083}, radius: 50},
}
