import mapboxgl from '!mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import {GLIDERPORT} from '../../types/gliderport'
import mockGliderports from '../../lib/data/gliderports'
let popup

export default (map, gliderports: GLIDERPORT[], setSelectedGliderportTitle) => {
  /* Add gliderports to map */
  const gliderportFeatures = getGliderportFeatures(gliderports)
  addGliderportSource(map, gliderportFeatures)
  handleGliderportMarkerClick(map, (e) => {
    setSelectedGliderportTitle(e)
  })
  addGliderportMarkers(map)
  addGliderportClusters(map)
  handleGliderportClusterClick(map)
  popup = new mapboxgl.Popup({closeButton: false, closeOnClick: false, closeOnMove: false})
  map.on('closePopup', () => {
    popup.remove()
  })
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

export const showActiveGliderportPopup = (map, activeGliderport) => {
  const coordinates = activeGliderport.coordinates.slice()

  map.easeTo({
    center: coordinates,
  })

  const zoomToGliderport = () => {
    map.easeTo({
      center: coordinates,
      zoom: 13,
      duration: 3000,
    })

    map.fire('closePopup')
  }

  const html = `
    <div>
      <p><b>${activeGliderport.title}</b></p>
      <button id='zoom-btn'>Zoom in</button>
    </div>
  `
  if (map.getZoom() >= 10) return

  popup.setLngLat(coordinates).setHTML(html).addTo(map)
  document.getElementById('zoom-btn').addEventListener('click', zoomToGliderport)
}

export const handleGliderportMarkerClick = (map, handleClick) => {
  map.on('click', 'gliderport-circles', (e) => {
    const properties = e.features[0].properties
    const gliderport = mockGliderports.find((g: GLIDERPORT) => g.title === properties.title)
    if (!gliderport) return

    handleClick({...gliderport}) // TODO in the future this should be the glideport ID
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
