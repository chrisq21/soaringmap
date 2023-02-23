import Head from 'next/head'
import Layout, {siteTitle} from '../components/layout'
import styles from '../styles/homepage.module.css'
import {getSortedPostsData} from '../lib/posts'
import {useEffect, useRef, useState} from 'react'
import {mockPOIs} from '../lib/data/mockPOIs'
import mockGliderOperations from '../lib/data/gliderports'
import mockRidgePOIs from '../lib/data/ridges'

import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from '!mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import {POI, POI_CATEGORY} from '../types/POI'
// TODO move to env file
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hyaXNxMjEiLCJhIjoiY2wyZTB5bmFqMTNuYjNjbGFnc3RyN25rbiJ9.4CAHYC8Sic49gsnwuP_fmA'

export default function Home() {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [lng, setLng] = useState(-70.9)
  const [lat, setLat] = useState(42.35)
  const [zoom, setZoom] = useState(4)

  /* Setup Map */
  useEffect(() => {
    if (map.current) return // initialize map only once

    map.current = new mapboxgl.Map({
      projection: 'mercator',
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v9',
      center: [-77.3513761, 39.75704], // TODO determine default
      zoom: zoom,
    })

    map.current.on('style.load', () => {
      map.current.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        // TODO research for performance
        tileSize: 512,
        maxzoom: 14,
      })

      map.current.setTerrain({
        source: 'mapbox-dem',
        exaggeration: 2.5,
      })

      /* Add map markers for POIs */
      const poiFeatures = mockPOIs.map(({description, category, coordinates}) => {
        let geometryData = {}

        const featureData = {
          type: 'Feature',
          properties: {
            description,
            icon: category === POI_CATEGORY.MOUNTAIN_PEAK ? 'range' : 'airfield',
            poiData: {
              coordinates,
              description,
              category,
            },
          },
        }

        if (category === POI_CATEGORY.RIDGE) {
          // ridge geometry
          geometryData = {
            properties: {
              color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // random color
            },
            geometry: {
              type: 'Polygon',
              coordinates,
            },
          }
        } else {
          // gliderport geometry
          geometryData = {
            geometry: {
              type: 'Point',
              coordinates,
            },
          }
        }

        return {
          ...featureData,
          ...geometryData,
        }
      })

      // Add features as sources
      map.current.addSource('glider-pois', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: poiFeatures,
        },
      })

      // Add gliderport layer
      map.current.addLayer({
        id: 'POI_icons',
        type: 'circle',
        source: 'glider-pois',
        paint: {
          'circle-radius': 6,
          'circle-color': '#B42222',
        },
        filter: ['==', '$type', 'Point'],
      })

      // Add ridges layer (line outline)
      map.current.addLayer({
        id: 'ridges_outline',
        type: 'line',
        source: 'glider-pois',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 3,
          'line-opacity': 0.5,
        },
      })
      // Add ridges layer (polygon)
      map.current.addLayer({
        id: 'ridges_polygon',
        type: 'fill',
        source: 'glider-pois',
        layout: {},
        paint: {
          'fill-color': '#0080ff', // blue color fill
          'fill-opacity': 0.1,
        },
      })

      map.current.on('click', 'POI_icons', (e) => {
        console.log('click!')
        const poiData = JSON.parse(e.features[0].properties.poiData)
        flyToPOI(poiData)
      })
      map.current.on('click', 'POI_lines', (e) => {
        console.log('click!')
        const poiData = JSON.parse(e.features[0].properties.poiData)
        flyToPOI(poiData)
      })
    })
  })

  const flyToPOI = ({coordinates, category}: POI) => {
    if (!map) return

    let flyData = {
      center: category === POI_CATEGORY.RIDGE ? coordinates[0] : coordinates,
    }

    flyData = {...flyData, zoom: 10, curve: 1, pitch: 0}
    map.current.flyTo(flyData)
  }

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={styles.container}>
        <div className={styles.sidebar}>
          {/* POIs categories*/}
          <div>
            <span className={styles.category}>Glider Operation</span>
            {mockGliderOperations.map((poi, index) => (
              <button key={index} className={styles.poiTitle} onClick={() => flyToPOI(poi)}>
                {poi.title}
              </button>
            ))}
          </div>
          <div>
            <span className={styles.category}>Ridges</span>
            {mockRidgePOIs.map((poi, index) => (
              <button key={index} className={styles.poiTitle} onClick={() => flyToPOI(poi)}>
                {poi.title}
              </button>
            ))}
          </div>
        </div>
        <div ref={mapContainer} className={styles.mapContainer} />
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData,
    },
  }
}
