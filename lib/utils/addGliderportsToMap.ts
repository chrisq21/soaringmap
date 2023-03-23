import mapboxgl from '!mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import {GLIDERPORT} from '../../types/gliderport'

export default (map, gliderports: GLIDERPORT[], setSelectedGliderport) => {
  /* Add gliderports to map */
  const gliderportFeatures = getGliderportFeatures(gliderports)
  addGliderportSource(map, gliderportFeatures)
  handleGliderportMarkerClick(map, (e) => {
    setSelectedGliderport(e)
  })
  addGliderportMarkers(map)
  addGliderportClusters(map)
  handleGliderportClusterClick(map)
}

export const getGliderportFeatures = (gliderportData) => {
  /* Create gliderport feature data */
  const features = gliderportData.map(({title, description, category, coordinates}, index) => {
    let geometryData = {}

    const featureData = {
      type: 'Feature',
      properties: {
        description,
        icon: 'airfield',
        title: title,
        id: index,
      },
    }

    // gliderport geometry
    geometryData = {
      geometry: {
        type: 'Point',
        coordinates,
      },
    }

    return {
      ...featureData,
      ...geometryData,
    }
  })
  return features
}

export const addGliderportSource = (map, features) => {
  map.addSource('gliderports-source', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features,
    },
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 30, // Radius of each cluster when clustering points (defaults to 50)
  })
  return map
}

export const addGliderportMarkers = (map) => {
  // gliderport circles
  map.addLayer({
    id: 'gliderport-circles',
    type: 'circle',
    source: 'gliderports-source',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': '#355C7D',
      'circle-radius': 15,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff',
      'circle-stroke-opacity': 1,
    },
  })

  // gliderport icons
  map.loadImage('./images/white-glider.png', (error, image) => {
    if (error) {
      console.error(error)
      return
    }

    map.addImage('glider-icon', image)

    map.addLayer({
      id: 'gliderport-icons',
      type: 'symbol',
      source: 'gliderports-source',
      filter: ['!', ['has', 'point_count']], // fliter out clusters
      layout: {
        'icon-image': 'glider-icon', // reference the image
        'icon-size': 0.08,
      },
    })
  })
}

export const handleGliderportMarkerClick = (map, handleClick) => {
  map.on('click', 'gliderport-circles', (e) => {
    const properties = e.features[0].properties
    const coordinates = e.features[0].geometry.coordinates.slice()

    const featureId = e.features[0].properties.id

    const currentZoom = map.getZoom()

    map.easeTo({
      center: coordinates,
      zoom: currentZoom < 5.3 ? 5.3 : currentZoom,
    })

    new mapboxgl.Popup().setLngLat(coordinates).setHTML(properties.title).addTo(map)
    handleClick(properties)
  })
}

/* Cluster setup  */
export const addGliderportClusters = (map) => {
  // gliderport cluster circles
  map.addLayer({
    id: 'gliderport-cluster-circles',
    type: 'circle',
    source: 'gliderports-source',
    filter: ['has', 'point_count'], // filter out gliderports (only get clusters)
    paint: {
      'circle-color': '#355C7D',
      'circle-radius': 15,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff',
      'circle-stroke-opacity': 1,
    },
  })

  // gliderport cluster text
  map.addLayer({
    id: 'gliderport-cluster-text',
    type: 'symbol',
    source: 'gliderports-source',
    filter: ['has', 'point_count'], // filter out gliderports (only get clusters)
    layout: {
      'text-field': ['get', 'point_count_abbreviated'],
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 24,
    },
    paint: {
      'text-color': '#ffffff',
    },
  })
}

export const handleGliderportClusterClick = (map) => {
  map.on('click', 'gliderport-cluster-circles', (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['gliderport-cluster-circles'],
    })

    const clusterId = features[0].properties.cluster_id
    map.getSource('gliderports-source').getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) return

      map.easeTo({
        center: features[0].geometry.coordinates,
        zoom: zoom + 1,
      })
    })
  })
}
