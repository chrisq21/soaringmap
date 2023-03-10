import React, {useState, useEffect} from 'react'
import mapboxgl from 'mapbox-gl'

const GliderportMap = () => {
  const [map, setMap] = useState(null)

  useEffect(() => {
    mapboxgl.accessToken = 'YOUR_MAPBOX_API_KEY'

    const initializeMap = () => {
      const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-96, 37.8],
        zoom: 3,
      })

      setMap(map)
    }

    if (!map) {
      initializeMap()
    }
  }, [map])

  useEffect(() => {
    const addGliderportsToMap = async () => {
      const response = await fetch(
        'https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/GliderportLocations/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json'
      )

      const data = await response.json()

      if (map) {
        map.on('load', () => {
          map.addSource('gliderports', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: data.features.map((feature) => ({
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [feature.geometry.x, feature.geometry.y],
                },
                properties: {
                  name: feature.attributes.NAME,
                  city: feature.attributes.CITY,
                  state: feature.attributes.STATE,
                },
              })),
            },
          })

          map.addLayer({
            id: 'gliderports',
            type: 'circle',
            source: 'gliderports',
            paint: {
              'circle-color': '#f00',
              'circle-radius': 8,
            },
          })

          map.on('click', 'gliderports', (e) => {
            const coordinates = e.features[0].geometry.coordinates.slice()
            const {name, city, state} = e.features[0].properties

            new mapboxgl.Popup().setLngLat(coordinates).setHTML(`<h3>${name}</h3><p>${city}, ${state}</p>`).addTo(map)
          })

          map.on('mouseenter', 'gliderports', () => {
            map.getCanvas().style.cursor = 'pointer'
          })

          map.on('mouseleave', 'gliderports', () => {
            map.getCanvas().style.cursor = ''
          })
        })
      }
    }

    addGliderportsToMap()
  }, [map])

  return (
    <div>
      <div id="map" style={{height: '500px'}} />
    </div>
  )
}

export default GliderportMap
