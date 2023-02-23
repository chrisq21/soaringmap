import {GLIDER_OPERATION_POI, POI_CATEGORY} from '../../types/POI'

/* Glider Operations */
const masaGliderport: GLIDER_OPERATION_POI = {
  coordinates: [-77.3513761, 39.75704],
  title: 'Mid-Atlantic Soaring Association',
  description: 'description',
  operationType: 'club',
  category: POI_CATEGORY.GLIDER_OPERATION,
}

const skylineSoaringClub: GLIDER_OPERATION_POI = {
  coordinates: [-78.2533733, 38.9175122],
  title: 'Skyline Soaring Club, Inc',
  description: 'description',
  operationType: 'club',
  category: POI_CATEGORY.GLIDER_OPERATION,
}

const arizonaSoaring: GLIDER_OPERATION_POI = {
  coordinates: [-112.1614, 33.0845],
  title: 'Arizona Soaring',
  description: 'description',
  operationType: 'club',
  category: POI_CATEGORY.GLIDER_OPERATION,
}

const chilhowee: GLIDER_OPERATION_POI = {
  coordinates: [-84.5849, 35.2265],
  title: 'Chilhowee Gliderport',
  description: 'description',
  operationType: 'commercial',
  category: POI_CATEGORY.GLIDER_OPERATION,
}

export default [chilhowee, arizonaSoaring, skylineSoaringClub, masaGliderport]
