import Head from 'next/head'
import Layout, {siteTitle} from '../components/layout'
import sharedStyles from '../styles/shared.module.css'
import styles from '../styles/homepage.module.css'
import {getSortedPostsData} from '../lib/posts'
import Link from 'next/link'
import {useEffect, useRef, useState} from 'react'

import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from '!mapbox-gl' // eslint-disable-line import/no-webpack-loader-syntax
// TODO move to env file
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hyaXNxMjEiLCJhIjoiY2wyZTB5bmFqMTNuYjNjbGFnc3RyN25rbiJ9.4CAHYC8Sic49gsnwuP_fmA'

export default function Home() {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [lng, setLng] = useState(-70.9)
  const [lat, setLat] = useState(42.35)
  const [zoom, setZoom] = useState(9)

  useEffect(() => {
    if (map.current) return // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom,
    })
  })

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={styles.container}>
        <div className={styles.sidebar}></div>
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
