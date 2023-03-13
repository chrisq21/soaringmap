import Head from 'next/head'
import Layout, {siteTitle} from '../components/layout'
import styles from '../styles/homepage.module.css'
import {getSortedPostsData} from '../lib/posts'
import {useEffect, useRef, useState} from 'react'
import mockGliderOperations from '../lib/data/operations'
import {mockPOIs} from '../lib/data/mockPOIs'

import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from '!mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
import {GLIDER_OPERATION_POI, POI, POI_CATEGORY} from '../types/POI'
import {addBaseMapStyles, configureMap} from '../lib/utils/mapSetup'
import {
  addClusterLayer,
  addClusterTextLayer,
  addGliderOperationClickHandler,
  addGliderOperationMarkers,
  addGliderOperationSource,
  getPOIFeatures,
} from '../lib/utils/mapPOISetup'
import List from '../components/List'
import Details from '../components/Details'
// TODO move to env file
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hyaXNxMjEiLCJhIjoiY2wyZTB5bmFqMTNuYjNjbGFnc3RyN25rbiJ9.4CAHYC8Sic49gsnwuP_fmA'

export default function Home() {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [zoom, setZoom] = useState(4)
  const [selectedOperation, setSelectedOperation] = useState<GLIDER_OPERATION_POI>(null)

  /* Setup Map */
  useEffect(() => {
    if (map.current) return

    map.current = configureMap(map.current, mapContainer.current, zoom)

    map.current.on('style.load', () => {
      addBaseMapStyles(map.current)

      /* Glider operation POI setup */
      const gliderOperationFeatures = getPOIFeatures(mockGliderOperations)
      addGliderOperationSource(map.current, gliderOperationFeatures)
      addGliderOperationClickHandler(map.current, (e) => {
        console.log(e)
        setSelectedOperation(e)
      })
      addGliderOperationMarkers(map.current, gliderOperationFeatures, styles.marker)

      // Clusters
      addClusterLayer(map.current)
      addClusterTextLayer(map.current)
    })
  })

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={styles.container}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div>
            {selectedOperation && <Details details={selectedOperation} handleClick={() => setSelectedOperation(null)} />}
            {!selectedOperation && (
              <List
                poiArray={mockGliderOperations}
                map={map}
                handleClick={(e) => {
                  console.log(e)
                  setSelectedOperation(e)
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
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData,
    },
  }
}
