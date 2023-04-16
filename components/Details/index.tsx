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

export default ({details, handleBackClick, handleImageClick}: {details: GLIDERPORT; handleBackClick: () => void; handleImageClick: () => void}) => {
  const [additionalDetails, setAdditionalDetails] = useState<AdditionalDetails>(null)
  const [seePhotosClicked, setSeePhotosClicked] = useState<boolean>(false)
  const {title, coordinates, state, city, website} = details

  const satelliteImageWidth = 400
  const satelliteImageHeight = 300
  const satelliteZoom = 15
  const accessToken = 'pk.eyJ1IjoiY2hyaXNxMjEiLCJhIjoiY2wyZTB5bmFqMTNuYjNjbGFnc3RyN25rbiJ9.4CAHYC8Sic49gsnwuP_fmA' // TODO move
  const googleAPIToken = 'AIzaSyDLO2h-SjND5NUMebJC9Bb9GIzr9f4s0JQ' // TODO move
  const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${details.coordinates
    .toString()
    .trim()},${satelliteZoom}/${satelliteImageWidth}x${satelliteImageHeight}?access_token=${accessToken}`

  const photosBaseUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&key=${googleAPIToken}`

  const fetchDetails = async () => {
    const detailsData = {
      title,
      coordinates,
    }

    try {
      const res = await fetch('/api/fetchDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(detailsData),
      })
      const data = await res.json()

      if (!data) {
        console.error('No data found')
        return
      }
      console.log(data)
      setAdditionalDetails(data)
      setSeePhotosClicked(true)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={styles.container}>
      <div>
        <a onClick={handleBackClick} className={`${styles.link} ${styles.backBtn}`}>
          {'< Back to list'}
        </a>
      </div>
      <div className={styles.headerContainer}>
        <div className={styles.headerTextContainer}>
          <h1 className={styles.title}>{title}</h1>
          <span className={styles.subtext}>
            {city}, {state}
          </span>
          {website && (
            <a className={styles.link} href={website} target={'_blank'}>
              Website url
            </a>
          )}
          {/* TODO add SSA url */}
          {true && (
            <a className={styles.link} href={website} target={'_blank'}>
              SSA chapter url
            </a>
          )}
        </div>
      </div>
      {/* Satellite Image */}
      <div className={styles.sectionsContainer}>
        <img className={`${styles.image} ${styles.link}`} src={staticMapUrl} alt="Gliderport" onClick={handleImageClick} />
        <div className={styles.satelliteContainer}>
          <span>Satellite image</span>
          <span onClick={handleImageClick} className={styles.link}>
            (see on map)
          </span>
        </div>
      </div>
      {!seePhotosClicked && <button onClick={fetchDetails}>See photos</button>}
      {additionalDetails && (
        <div className={styles.sectionsContainer}>
          {/* Photos section */}
          {additionalDetails?.photos && (
            <div className={styles.section}>
              <div>
                <h2 className={styles.sectionTitle}>Photos</h2>
                <span className={styles.subtext}>source: Google maps</span>
              </div>
              {additionalDetails.photos.length > 0 &&
                additionalDetails.photos.map((photo, index) => {
                  return <img className={styles.image} src={`${photosBaseUrl}&photo_reference=${photo.photo_reference}`} alt="Gliderport photo" key={index} />
                })}
            </div>
          )}
        </div>
      )}

      {seePhotosClicked && (!additionalDetails || !additionalDetails.photos || !additionalDetails.photos.length) && <span>No photos found on Google Maps</span>}
    </div>
  )
}
