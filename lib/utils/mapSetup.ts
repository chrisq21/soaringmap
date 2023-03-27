import mapboxgl from '!mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax

export const configureMap = (map, mapContainer, zoom) => {
  const mapInstance = new mapboxgl.Map({
    projection: 'mercator',
    container: mapContainer,
    style: 'mapbox://styles/mapbox/outdoors-v9',
    center: [-77.3513761, 39.75704], // TODO determine default
    zoom: zoom,
  })
  return mapInstance
}

export const addBaseMapStyles = (map) => {
  map.addSource('mapbox-dem', {
    type: 'raster-dem',
    url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
    // TODO research for performance
    tileSize: 512,
    maxzoom: 14,
  })

  map.setTerrain({
    source: 'mapbox-dem',
    exaggeration: 1,
  })
}
