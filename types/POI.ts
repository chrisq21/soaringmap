export enum POI_TYPE {
  AIRPORT = 'airport',
  GLIDER_OPERATION = 'glider_operation',
  RIDGE = 'ridge',
  MOUNTAIN_PEAK = 'mountain_peak',
  CALLOUT = 'callout',
}

export type POI = {
  latitude: number
  longitude: number
  title: string
  description: string
  type: POI_TYPE
}

export type AIRPORT_AIRFIELD_POI = POI & {
  type: POI_TYPE.AIRPORT
  airportAirfieldType: 'airport' | 'airfield'
  identifier: string
  elevation: number // in feet MSL?
}

export type GLIDER_OPERATION_POI = POI & {
  type: POI_TYPE.GLIDER_OPERATION
  operationType: 'commerical' | 'club'
  // airportAirfield: AIRPORT_AIRFIELD_POI
}

export type RIDGE_POI = POI & {
  type: POI_TYPE.RIDGE
}

export type MOUNTAIN_PEAK_POI = POI & {
  type: POI_TYPE.MOUNTAIN_PEAK
}

export type CALLOUT_POI = POI & {
  type: POI_TYPE.CALLOUT
}
