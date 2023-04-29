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

enum DetailImageType {
  SURROUNDING_AREA = 'Surrounding area',
  AIRPORT = 'Airport',
  THREED = '3d',
}

const getStaticMapUrl = (coordinates: string, imageType: DetailImageType) => {
  const baseURL = `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${coordinates}`
  const imageWidth = 400
  const imageHeight = 300
  let zoom = 15

  if (imageType === DetailImageType.SURROUNDING_AREA) {
    zoom = 10
  } else if (imageType === DetailImageType.AIRPORT) {
    zoom = 15
  }

  console.log('zoom: ', zoom)

  return `${baseURL},${zoom}/${imageWidth}x${imageHeight}?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
}

export default ({details, handleBackClick, handleImageClick}: {details: GLIDERPORT; handleBackClick: () => void; handleImageClick: () => void}) => {
  const [additionalDetails, setAdditionalDetails] = useState<AdditionalDetails>(null)
  const [seePhotosClicked, setSeePhotosClicked] = useState<boolean>(false)
  const {title, coordinates, state, city, website, ssaUrl} = details

  const [imageType, setImageType] = useState<DetailImageType>(DetailImageType.AIRPORT)

  const googleAPIToken = process.env.NEXT_PUBLIC_GOOGLE_PLACES_TOKEN
  const staticMapUrl = getStaticMapUrl(coordinates.toString().trim(), imageType)

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
    <>
      <div className={styles.backContainer}>
        <a onClick={handleBackClick} className={`${styles.link} ${styles.backBtn}`}>
          {'< Back to list'}
        </a>
      </div>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.headerContainer}>
          <div className={styles.headerTextContainer}>
            <h1 className={styles.title}>{title}</h1>
            <span className={styles.subtext}>
              {city}, {state}
            </span>
          </div>
        </div>
        {/* Satellite Image */}
        <div className={`${styles.section} ${styles.imageSection}`}>
          <div className={styles.imageTypeContainer}>
            <span
              className={`${styles.imageType} ${imageType === DetailImageType.AIRPORT && styles.activeImageType}`}
              onClick={() => setImageType(DetailImageType.AIRPORT)}
            >
              {DetailImageType.AIRPORT}
            </span>
            <span
              className={`${styles.imageType} ${imageType === DetailImageType.SURROUNDING_AREA && styles.activeImageType}`}
              onClick={() => setImageType(DetailImageType.SURROUNDING_AREA)}
            >
              {DetailImageType.SURROUNDING_AREA}
            </span>
            {/* <span onClick={() => setImageType(DetailImageType.THREED)}>3D Terrain</span> */}
          </div>
          <div className={styles.imageContainer}>
            <img className={`${styles.image} ${styles.link}`} src={staticMapUrl} alt="Gliderport" onClick={handleImageClick} />

            <div className={styles.overlay} onClick={handleImageClick}>
              <span className={styles.overlayLink}>See on map</span>
            </div>
          </div>

          <div className={styles.satelliteContainer}></div>
        </div>
        {/* Links & Info */}
        <div className={styles.section}>
          {website && (
            <a className={styles.link} href={website} target={'_blank'}>
              Website link
            </a>
          )}
          {ssaUrl && (
            <a className={styles.link} href={ssaUrl} target={'_blank'}>
              SSA chapter link
            </a>
          )}
        </div>

        <div className={styles.section}>
          {!seePhotosClicked && <button onClick={fetchDetails}>Load Google photos</button>}
          {seePhotosClicked && (
            <>
              <h2 className={styles.sectionTitle}>Google Photos</h2>
              {additionalDetails?.photos?.length > 0 &&
                additionalDetails.photos.map((photo, index) => (
                  <img className={styles.image} src={`${photosBaseUrl}&photo_reference=${photo.photo_reference}`} alt="Gliderport photo" key={index} />
                ))}
              {(!additionalDetails || !additionalDetails.photos || !additionalDetails.photos.length) && <span>No photos found on Google Maps</span>}
            </>
          )}
        </div>
      </div>
    </>
  )
}
