import mapboxgl from 'mapbox-gl'

export const configureMap = (map, mapContainer, zoom) => {
  const mapInstance = new mapboxgl.Map({
    container: mapContainer,
    style: 'mapbox://styles/mapbox/outdoors-v9',
    center: [-94.95494901349059, 38.809949873101374], // Kansas
    zoom: zoom,
  })
  mapInstance.addControl(new mapboxgl.NavigationControl())
  mapInstance.setProjection('mercator')
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
