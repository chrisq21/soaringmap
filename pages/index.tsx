import Head from 'next/head'
import Layout, {siteTitle} from '../components/layout'
import styles from '../styles/homepage.module.css'
import {getSortedPostsData} from '../lib/posts'
import {useEffect, useRef, useState} from 'react'
import {mockGliderOperations, mockRidgePOIs} from '../lib/data/mockPOIs'

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
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [-77.3513761, 39.75704], // TODO determine default
      zoom: zoom,
    })

    map.current.on('style.load', () => {
      map.current.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14,
      })

      map.current.setTerrain({
        source: 'mapbox-dem',
        exaggeration: 2,
      })
    })
  })

  const handlePOISelected = ({latitude, longitude}: POI) => {
    if (!map) return
    map.current.flyTo({
      center: [longitude, latitude],
      zoom: 9,
      speed: 0.8,
      curve: 1,
      easing(t) {
        return t
      },
    })
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
              <button key={index} className={styles.poiTitle} onClick={() => handlePOISelected(poi)}>
                {poi.title}
              </button>
            ))}
          </div>
          <div>
            <span className={styles.category}>Ridges</span>
            {mockRidgePOIs.map((poi, index) => (
              <button key={index} className={styles.poiTitle} onClick={() => handlePOISelected(poi)}>
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
