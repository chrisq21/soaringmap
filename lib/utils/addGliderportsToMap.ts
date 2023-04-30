import mapboxgl from 'mapbox-gl'
import {GLIDERPORT} from '../../types/gliderport'
let popup

export default (map, gliderports: GLIDERPORT[], setSelectedGliderportTitle) => {
  /* Add gliderports to map */
  const gliderportFeatures = getGliderportFeatures(gliderports)
  addGliderportSource(map, gliderportFeatures)
  handleGliderportMarkerClick(map, gliderports, (e) => {
    setSelectedGliderportTitle(e)
  })
  addGliderportMarkers(map)
  addGliderportClusters(map)
  handleGliderportClusterClick(map)
  popup = new mapboxgl.Popup({closeButton: true, closeOnClick: false, closeOnMove: false})
  map.on('closePopup', () => {
    popup.remove()
  })
}

export const getGliderportFeatures = (gliderportData) => {
  /* Create gliderport feature data */
  const features = gliderportData.map(({title, coordinates}, index) => {
    let geometryData = {}

    const featureData = {
      type: 'Feature',
      properties: {
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
    clusterRadius: 40, // Radius of each cluster when clustering points (defaults to 50)
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
        'icon-size': 0.07,
      },
    })

    map.addLayer({
      id: 'gliderport-text',
      type: 'symbol',
      source: 'gliderports-source',
      filter: ['!', ['has', 'point_count']], // fliter out clusters
      layout: {
        'text-field': ['get', 'title'], // replace 'name' with the name of the property containing the text to display
        'text-font': ['Montserrat Bold'], // set the font for the text
        'text-size': 9, // set the size for the text
        'text-offset': [0, 2],
        'text-anchor': 'top', // set the text anchor to the top of the icon
        'text-allow-overlap': false, // allow text to overlap with other symbols
      },
      paint: {
        'text-color': '#000000', // set the color for the text
      },
    })
  })
}

export const showActiveGliderportPopup = (map, activeGliderport) => {
  const coordinates = activeGliderport.coordinates.slice()

  map.easeTo({
    center: coordinates,
  })

  const zoomToGliderport = (e) => {
    const zoomedInValue = 14
    const zoomedOutValue = 5

    if (map.getZoom() >= 10) {
      // zoom out
      map.easeTo({
        center: coordinates,
        zoom: zoomedOutValue,
        duration: 3000,
        pitch: 0,
      })
    } else {
      // zoom in
      map.easeTo({
        center: coordinates,
        zoom: zoomedInValue,
        duration: 3000,
      })
    }

    map.fire('closePopup')
  }

  const zoomText = map.getZoom() >= 10 ? 'Zoom out' : 'Zoom in'

  const html = `
      <p><b>${activeGliderport.title}</b></p>
      <button id='zoom-btn'>${zoomText}</button>
  `
  // if (map.getZoom() >= 10) return

  popup.setLngLat(coordinates).setHTML(html).addTo(map)
  document.getElementById('zoom-btn').addEventListener('click', zoomToGliderport)
}

export const handleGliderportMarkerClick = (map, gliderports, handleClick) => {
  map.on('click', 'gliderport-circles', (e) => {
    const properties = e.features[0].properties
    const gliderport = gliderports.find((g: GLIDERPORT) => g.title === properties.title)
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
