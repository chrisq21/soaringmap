import Head from 'next/head'
import Layout, {siteTitle} from '../components/layout'
import styles from '../styles/homepage.module.css'
import {getSortedPostsData} from '../lib/posts'
import {useEffect, useRef, useState} from 'react'
import mockGliderports from '../lib/data/gliderports'

import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from '!mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import {GLIDERPORT} from '../types/gliderport'
import {addBaseMapStyles, configureMap} from '../lib/utils/mapSetup'
import addGliderportsToMap, {showActiveGliderportPopup} from '../lib/utils/addGliderportsToMap'
import List from '../components/List'
import Details from '../components/Details'
import {fetchGliderports} from '../lib/utils/fetchGliderports'
// TODO move to env file
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hyaXNxMjEiLCJhIjoiY2wyZTB5bmFqMTNuYjNjbGFnc3RyN25rbiJ9.4CAHYC8Sic49gsnwuP_fmA'

export default function Home({gliderports}) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [zoom, setZoom] = useState(4)
  const [selectedGliderport, setSelectedGliderport] = useState<GLIDERPORT>(null)

  console.log('gliderports', gliderports)
  const data = gliderports[0].fields

  const testGliderport: GLIDERPORT = {
    title: data.title,
    coordinates: data.coordinates,
    description: data.description,
    operationType: data.isClub ? 'club' : 'commercial',
    website: data.website,
    image: data.image,
    satelliteImage: data.satelliteImage,
  }

  const allGliderports = [...mockGliderports, testGliderport]

  /* Setup Map */
  useEffect(() => {
    if (map.current) return

    map.current = configureMap(map.current, mapContainer.current, zoom)

    map.current.on('style.load', () => {
      addBaseMapStyles(map.current)
      addGliderportsToMap(map.current, allGliderports, setSelectedGliderport)
    })
  })

  useEffect(() => {
    if (selectedGliderport) {
      console.log('selectedGliderport', selectedGliderport.title)
      showActiveGliderportPopup(map.current, selectedGliderport)
    }

    if (!selectedGliderport) {
      map.current.fire('closePopup')
    }
  }, [selectedGliderport])

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={styles.container}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div>
            {selectedGliderport && <Details details={selectedGliderport} handleClick={() => setSelectedGliderport(null)} />}
            {!selectedGliderport && (
              <List
                items={allGliderports}
                map={map}
                handleClick={(e) => {
                  setSelectedGliderport(e)
                }}
              />
            )}
          </div>
        </div>
        {/* Map */}
        <div ref={mapContainer} className={styles.mapContainer} />
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const gliderports = await fetchGliderports()
  console.log('gliderports', gliderports)
  return {
    props: {gliderports},
  }
}
