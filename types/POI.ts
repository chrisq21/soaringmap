export enum POI_CATEGORY {
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
  category: POI_CATEGORY
}

export type AIRPORT_AIRFIELD_POI = POI & {
  category: POI_CATEGORY.AIRPORT
  airportAirfieldType: 'airport' | 'airfield'
  identifier: string
  elevation: number // in feet MSL?
}

export type GLIDER_OPERATION_POI = POI & {
  category: POI_CATEGORY.GLIDER_OPERATION
  operationType: 'commerical' | 'club'
  // airportAirfield: AIRPORT_AIRFIELD_POI
}

export type RIDGE_POI = POI & {
  category: POI_CATEGORY.RIDGE
}

export type MOUNTAIN_PEAK_POI = POI & {
  category: POI_CATEGORY.MOUNTAIN_PEAK
}

export type CALLOUT_POI = POI & {
  category: POI_CATEGORY.CALLOUT
}
