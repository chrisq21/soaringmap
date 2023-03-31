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
  const [seeMorePhotos, setSeeMorePhotos] = useState<boolean>(false)
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

  useEffect(() => {
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
        console.log(data.photos)
        setAdditionalDetails(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchDetails()
  }, [title])

  return (
    <div className={styles.container}>
      <div>
        <a onClick={handleBackClick} className={styles.link}>
          {'< Back to list'}
        </a>
      </div>
      <div className={styles.headerContainer}>
        <div className={styles.headerTextContainer}>
          <h1 className={styles.title}>{title}</h1>
          <span className={styles.subtext}>
            {city}, {state}
          </span>
          <a className={styles.link} href={website} target={'_blank'}>
            {website}
          </a>
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
      {additionalDetails && (
        <div className={styles.sectionsContainer}>
          {/* Photos section */}
          {additionalDetails?.photos && (
            <div className={styles.section}>
              <div>
                <h2 className={styles.sectionTitle}>Photo(s)</h2>
                <span className={styles.subtext}>source: Google maps</span>
              </div>
              {additionalDetails.photos.map((photo, index) => {
                if (!seeMorePhotos && index !== 0) return
                return <img className={styles.image} src={`${photosBaseUrl}&photo_reference=${photo.photo_reference}`} alt="Gliderport photo" key={index} />
              })}
              {additionalDetails.photos.length > 1 && !seeMorePhotos && (
                <button
                  onClick={() => {
                    setSeeMorePhotos(true)
                  }}
                >
                  See more photos
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
