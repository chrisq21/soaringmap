import mapboxgl from '!mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax

export const getPOIFeatures = (gliderOperationsData) => {
  /* Create gliderport feature data */
  const features = gliderOperationsData.map(({title, description, category, coordinates}, index) => {
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

export const addGliderOperationSource = (map, features) => {
  map.addSource('glider-pois', {
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

export const addGliderOperationClickHandler = (map, handleClick) => {
  map.on('click', 'gliderport-points', (e) => {
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

export const addGliderOperationMarkers = (map, features, markerStyles) => {
  // Used for click handler, but hidden behind custom markers
  map.addLayer({
    id: 'gliderport-points',
    type: 'circle',
    source: 'glider-pois',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': '#355C7D',
      'circle-radius': 15,
      'circle-stroke-width': 2,

      'circle-stroke-color': '#ffffff',
      'circle-stroke-opacity': 1,
    },
  })

  map.loadImage('./images/white-glider.png', (error, image) => {
    if (error) {
      console.error(error)
      return
    }

    map.addImage('glider-icon', image)

    map.addLayer({
      id: 'points',
      type: 'symbol',
      source: 'glider-pois',
      filter: ['!', ['has', 'point_count']],
      layout: {
        'icon-image': 'glider-icon', // reference the image
        'icon-size': 0.08,
      },
    })
  })
}

/* Cluster setup  */

export const addClusterLayer = (map) => {
  // Add cluster points
  map.addLayer({
    id: 'gliderport-clusters',
    type: 'circle',
    source: 'glider-pois',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': '#355C7D',
      'circle-radius': 15,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff',
      'circle-stroke-opacity': 1,
    },
  })
}

export const addClusterTextLayer = (map) => {
  // // Text in cluster
  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'glider-pois',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': ['get', 'point_count_abbreviated'],
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 24,
    },
    paint: {
      'text-color': '#ffffff',
    },
  })

  // click handler
  map.on('click', 'gliderport-clusters', (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['gliderport-clusters'],
    })

    const clusterId = features[0].properties.cluster_id
    map.getSource('glider-pois').getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) return

      map.easeTo({
        center: features[0].geometry.coordinates,
        zoom: zoom + 1,
      })
    })
  })
}
