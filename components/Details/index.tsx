import {useEffect, useState} from 'react'
import {GLIDERPORT} from '../../types/gliderport'
import styles from './Details.module.css'

type AdditionalDetails = {
  formatted_phone_number: string
  website: string
  name: string
  formatted_address: string
  opening_hours: string
  photos: any
}

export default ({details, handleClick, handleImageClick}: {details: GLIDERPORT; handleClick: () => void; handleImageClick: () => void}) => {
  const [additionalDetails, setAdditionalDetails] = useState<AdditionalDetails>(null)
  const {formatted_address, website, formatted_phone_number} = additionalDetails || {}
  const {title, coordinates, state, city} = details

  const satelliteImageWidth = 400
  const satelliteImageHeight = 300
  const satelliteZoom = 15
  const accessToken = 'pk.eyJ1IjoiY2hyaXNxMjEiLCJhIjoiY2wyZTB5bmFqMTNuYjNjbGFnc3RyN25rbiJ9.4CAHYC8Sic49gsnwuP_fmA' // TODO move
  const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${details.coordinates.toString()},${satelliteZoom}/${satelliteImageWidth}x${satelliteImageHeight}?access_token=${accessToken}`

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch('/api/fetchDetails')
        const data = await res.json()

        if (!data) {
          console.error('No data found')
          return
        }

        setAdditionalDetails(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchDetails()
  }, [])

  return (
    <div className={styles.container}>
      <div>
        <button onClick={handleClick} className={styles.backBtn}>
          Back home
        </button>
      </div>
      <div className={styles.headerContainer}>
        <div className={styles.headerTextContainer}>
          <h1 className={styles.title}>{title}</h1>
          <span className={styles.subtext}>
            {city}, {state}
          </span>
        </div>
      </div>
      {/* Satellite Image */}
      <div className={styles.sectionsContainer}>
        <img className={styles.satelliteImage} src={staticMapUrl} alt="Gliderport" />
        <div className={styles.satelliteContainer}>
          <span>Satellite image</span>
          <span onClick={handleImageClick} className={styles.link}>
            (see on map)
          </span>
        </div>
      </div>
      {additionalDetails && (
        <div className={styles.sectionsContainer}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Contact Information</h2>
            <a className={styles.link} href={website} target="_blank">
              {website}
            </a>
            <p className={styles.sectionText}>{formatted_phone_number}</p>
            <p className={styles.sectionText}>{formatted_address}</p>
          </div>
        </div>
      )}
    </div>
  )
}
