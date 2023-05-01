import {useEffect, useState} from 'react'
import {GLIDERPORT} from '../../types/gliderport'
import styles from './Details.module.css'
import {BsLink45Deg} from 'react-icons/bs'
import {BiArrowBack} from 'react-icons/bi'
import {FaMapMarkerAlt} from 'react-icons/fa'
import {MdAirplanemodeActive} from 'react-icons/md'

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
  SECTIONAL = 'Sectional',
}

const getStaticMapUrl = (coordinates: Array<number>, imageType: DetailImageType) => {
  const coordinatesTrimmed = coordinates.toString().trim()

  const baseURL = `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${coordinatesTrimmed}`
  const sectionUrl = `https://vfrmap.com/api?req=map&type=sectc&lat=${coordinates[1]}&lon=${coordinates[0]}&zoom=10&width=400&height=300`

  const imageWidth = 400
  const imageHeight = 300
  let zoom = 15

  if (imageType === DetailImageType.SECTIONAL) {
    return sectionUrl
  }

  if (imageType === DetailImageType.SURROUNDING_AREA) {
    zoom = 10
  } else if (imageType === DetailImageType.AIRPORT) {
    zoom = 15
  }

  return `${baseURL},${zoom}/${imageWidth}x${imageHeight}?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
}

export default ({details, handleBackClick, handleImageClick}: {details: GLIDERPORT; handleBackClick: () => void; handleImageClick: (zoom: number) => void}) => {
  const [additionalDetails, setAdditionalDetails] = useState<AdditionalDetails>(null)
  const [seePhotosClicked, setSeePhotosClicked] = useState<boolean>(false)
  const {title, coordinates, state, city, website, ssaUrl, airportID} = details

  const [imageType, setImageType] = useState<DetailImageType>(DetailImageType.AIRPORT)

  const googleAPIToken = process.env.NEXT_PUBLIC_GOOGLE_PLACES_TOKEN
  const staticMapUrl = getStaticMapUrl(coordinates, imageType)

  const photosBaseUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&key=${googleAPIToken}`
  const sectionURL = `https://www.vfrmap.com/?type=vfrc&lat=${coordinates[1]}&lon=${coordinates[0]}&zoom=10`

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
          <BiArrowBack />
          {' Back'}
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
            <span
              className={`${styles.imageType} ${imageType === DetailImageType.SECTIONAL && styles.activeImageType}`}
              onClick={() => setImageType(DetailImageType.SECTIONAL)}
            >
              {DetailImageType.SECTIONAL}
            </span>
          </div>
          <div className={styles.imageContainer}>
            <img className={`${styles.image} ${styles.link}`} src={staticMapUrl} alt="Gliderport" />
            {/* Link to VFRMap for sectional */}
            {imageType === DetailImageType.SECTIONAL && <a href={sectionURL} target="_blank" className={styles.overlay} />}
            {/* Otherwise show the image on the map */}
            {imageType !== DetailImageType.SECTIONAL && (
              <div
                className={styles.overlay}
                onClick={() => {
                  const zoom = imageType === DetailImageType.SURROUNDING_AREA ? 10 : 15
                  handleImageClick(zoom)
                }}
              >
                <span className={styles.overlayLink}>See on map</span>
              </div>
            )}
          </div>
          <div className={styles.satelliteContainer}></div>
        </div>
        {/* Links & Info */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>General Information</h2>

          {website && (
            <div className={styles.resource}>
              <BsLink45Deg />{' '}
              <a className={styles.link} href={website} target={'_blank'}>
                Website
              </a>
            </div>
          )}
          {ssaUrl && (
            <div className={styles.resource}>
              <BsLink45Deg />{' '}
              <a className={styles.link} href={ssaUrl} target={'_blank'}>
                SSA chapter
              </a>
            </div>
          )}
          {airportID && (
            <div className={styles.resource}>
              <MdAirplanemodeActive /> <span>Airport identifier: {airportID}</span>
            </div>
          )}
          <div className={styles.resource}>
            <FaMapMarkerAlt />{' '}
            <a className={styles.link} href={`http://www.google.com/maps/place/${coordinates[1]},${coordinates[0]}`} target={'_blank'}>
              Google maps
            </a>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Google Photos</h2>
          {!seePhotosClicked && <button onClick={fetchDetails}>Load Google photos</button>}
          {seePhotosClicked && (
            <>
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
