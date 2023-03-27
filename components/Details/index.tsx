import {GLIDERPORT} from '../../types/gliderport'
import styles from './Details.module.css'

export default ({details, handleClick}: {details: GLIDERPORT; handleClick: () => void}) => {
  const {title, operationType, description, website, image, satelliteImage} = details
  console.log(details)
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
          <span className={styles.subtext}>Front Royal, VA</span>
          <a className={styles.link} href={website}>
            {website}
          </a>
        </div>
        <img src={image?.fields?.file?.url || './images/gliderport.jpeg'} alt="Gliderport" />
      </div>
      <div className={styles.sectionsContainer}>
        <img className={styles.satelliteImage} src={satelliteImage?.fields?.file?.url || './images/gliderport.jpeg'} alt="Gliderport" />
        <span>Satellite image</span>
        <span>See on map</span>
      </div>
      <div className={styles.sectionsContainer}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Description</h2>
          <p className={styles.sectionText}>{description}</p>
        </div>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Lift sources</h2>
          <p className={styles.sectionText}>Thermals, Ridge, Wave</p>
        </div>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Operation times</h2>
          <p className={styles.sectionText}>
            <li>Weekends only</li>
            <li>March, April, May, June, July, August, September, October, November, December</li>
          </p>
        </div>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Contact</h2>
          <p className={styles.sectionText}>welcome@skylinesoaring.org</p>
          <p className={styles.sectionText}>(302) 743-7359</p>
        </div>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Additional Information</h2>
          <p className={styles.sectionText}>
            <li>Offers flight training: Yes</li>
            <li>Members only: Yes</li>
            <li>Offers FAST flights: Yes</li>
          </p>
        </div>
      </div>
    </div>
  )
}
