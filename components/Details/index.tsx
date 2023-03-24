import {GLIDERPORT} from '../../types/gliderport'
import styles from './Details.module.css'

export default ({details, handleClick}: {details: GLIDERPORT; handleClick: () => void}) => {
  const {title, operationType} = details
  return (
    <div className={styles.container}>
      <div>
        <button onClick={handleClick} className={styles.backBtn}>
          Back home
        </button>
      </div>
      <div className={styles.headerContainer}>
        <img src="./images/gliderport.jpeg" alt="Gliderport" />
        <div className={styles.contentContainer}>
          <div>
            <h1 className={styles.title}>Skyline Soaring Club</h1>
            <span className={styles.subtext}>Front Royal, VA</span>
          </div>
          <div>
            <div className={styles.subtext}>
              <span>Type:</span> <span className={styles.type}>Commerical</span>
            </div>
            <a href="https://www.skylinesoaring.org/" className={styles.link} target="_blank">
              www.skylinesoaring.org
            </a>
          </div>
        </div>
      </div>
      <div className={styles.sectionsContainer}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Description</h2>
          <p className={styles.sectionText}>Come soar with us over the beautiful and historic shenendoah valley. Our club offers a wide ra…</p>
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
