import mapboxgl from '!mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax

export const getPOIFeatures = (gliderOperationsData) => {
  /* Create gliderport feature data */
  const features = gliderOperationsData.map(({title, description, category, coordinates}) => {
    let geometryData = {}

    const featureData = {
      type: 'Feature',
      properties: {
        description,
        icon: 'airfield',
        title: title,
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
    clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
  })
  return map
}

export const addGliderOperationClickHandler = (map, zoom) => {
  map.on('click', 'gliderport-points', (e) => {
    const title = e.features[0].properties.title
    const coordinates = e.features[0].geometry.coordinates.slice()

    map.easeTo({
      center: coordinates,
    })

    new mapboxgl.Popup().setLngLat(coordinates).setHTML(title).addTo(map)
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
      'circle-color': '#FFA500',
      'circle-radius': 10,
    },
  })
  // add markers to map
  // TODO filter out cluster
  // for (const feature of features) {
  //   // create a HTML element for each feature
  //   const el = document.createElement('div')
  //   el.innerHTML = 5
  //   el.className = markerStyles
  //   el.id = 'gliderport-points'
  //   // make a marker for each feature and add to the map
  //   new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).addTo(map)
  // }
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
      // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
      'circle-color': '#FFA500',
      'circle-radius': ['step', ['get', 'point_count'], 17, 2, 20, 3, 23],
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
