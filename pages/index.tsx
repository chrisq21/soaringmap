import Head from 'next/head'
import Layout, {siteTitle} from '../components/layout'
import styles from '../styles/homepage.module.css'
import {useEffect, useRef, useState} from 'react'

import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'
import {GLIDERPORT} from '../types/gliderport'
import {addBaseMapStyles, configureMap} from '../lib/utils/mapSetup'
import addGliderportsToMap, {showActiveGliderportPopup} from '../lib/utils/addGliderportsToMap'
import List from '../components/List'
import Details from '../components/Details'
import {fetchGliderports} from '../lib/utils/fetchGliderports'
// TODO move to env file
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hyaXNxMjEiLCJhIjoiY2wyZTB5bmFqMTNuYjNjbGFnc3RyN25rbiJ9.4CAHYC8Sic49gsnwuP_fmA'

export default function Home({gliderportData}) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [zoom, setZoom] = useState(3.5)
  const [selectedGliderport, setSelectedGliderport] = useState<GLIDERPORT>(null)
  const [isDefaultMap, setIsDefaultMap] = useState<boolean | null>(null)

  const allGliderports: GLIDERPORT[] = gliderportData.map((gliderport) => {
    const {fields} = gliderport
    return {
      title: fields.title,
      coordinates: fields.coordinates,
      state: fields.state,
      city: fields.city,
      website: fields.website,
      ssaUrl: fields.ssaUrl,
    }
  })

  /* Setup Map */
  useEffect(() => {
    if (map.current) return

    map.current = configureMap(map.current, mapContainer.current, zoom)

    map.current.on('style.load', () => {
      map.current.fire('closePopup')
      addBaseMapStyles(map.current)
      addGliderportsToMap(map.current, allGliderports, setSelectedGliderport)
    })
  }, [])

  useEffect(() => {
    if (selectedGliderport) {
      showActiveGliderportPopup(map.current, selectedGliderport)
    }

    if (!selectedGliderport) {
      map.current.fire('closePopup')
    }
  }, [selectedGliderport])

  useEffect(() => {
    if (!map.current) return

    if (isDefaultMap === null) return

    if (isDefaultMap && map.current.getStyle().name.toLowerCase().includes('satellite')) {
      map.current.setStyle('mapbox://styles/mapbox/outdoors-v9')
    } else if (!isDefaultMap && map.current.getStyle().name.toLowerCase().includes('outdoors')) {
      map.current.setStyle('mapbox://styles/chrisq21/clgmgjkp9000w01qo2hvrh3b4')
    }
  }, [isDefaultMap])

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={styles.container}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div>
            {selectedGliderport && (
              <Details
                key={selectedGliderport.title}
                details={selectedGliderport}
                handleBackClick={() => {
                  setSelectedGliderport(null)
                  map.current.flyTo({
                    zoom: 4,
                    duration: 0,
                  })
                }}
                handleImageClick={() => {
                  // clicked satellite image
                  setIsDefaultMap(false)
                  map.current.flyTo({
                    center: selectedGliderport.coordinates,
                    zoom: 14,
                    duration: 0,
                  })
                }}
              />
            )}
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
        <div ref={mapContainer} className={styles.mapContainer}>
          <div className={styles.mapStyleSwitcher}>
            <span>Map type: </span>
            <label
              onClick={() => {
                if (!isDefaultMap && isDefaultMap !== null) setIsDefaultMap(true)
              }}
            >
              <input type="radio" value="default" name="map-style" checked={isDefaultMap || isDefaultMap === null} /> Default
            </label>
            <label
              onClick={() => {
                if (isDefaultMap || isDefaultMap === null) setIsDefaultMap(false)
              }}
            >
              <input type="radio" value="satellite" name="map-style" checked={!isDefaultMap && isDefaultMap !== null} /> Satellite
            </label>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const gliderportData = await fetchGliderports()
  return {
    props: {gliderportData},
  }
}
