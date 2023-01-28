import {GLIDER_OPERATION_POI, POI, POI_CATEGORY, RIDGE_POI} from '../../types/POI'

/* Glider Operations */
const masaGliderport: GLIDER_OPERATION_POI = {
  latitude: 39.75704,
  longitude: -77.3513761,
  title: 'Mid-Atlantic Soaring Association',
  description: 'description',
  operationType: 'club',
  category: POI_CATEGORY.GLIDER_OPERATION,
}

const skylineSoaringClub: GLIDER_OPERATION_POI = {
  latitude: 38.9175122,
  longitude: -78.2533733,
  title: 'Skyline Soaring Club, Inc',
  description: 'description',
  operationType: 'club',
  category: POI_CATEGORY.GLIDER_OPERATION,
}

/* Ridges */
const tuscarora: RIDGE_POI = {
  latitude: 40.484886,
  longitude: -77.361345,
  title: 'Tuscarora Ridge',
  description: 'description',
  category: POI_CATEGORY.RIDGE,
}

const mcConnellsburg: RIDGE_POI = {
  latitude: 39.9686,
  longitude: -77.8939,
  title: 'McConnellsburg Ridge',
  description: 'description',
  category: POI_CATEGORY.RIDGE,
}

const dickeys: RIDGE_POI = {
  latitude: 39.803638,
  longitude: -78.053903,
  title: 'Dickeys Ridge',
  description: 'description',
  category: POI_CATEGORY.RIDGE,
}

export const mockRidgePOIs = [tuscarora, mcConnellsburg, dickeys]

export const mockGliderOperations = [masaGliderport, skylineSoaringClub]

export const mockPOIs: POI[] = [...mockGliderOperations, ...mockRidgePOIs]
