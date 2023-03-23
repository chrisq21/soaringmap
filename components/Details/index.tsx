import {GLIDER_OPERATION_POI} from '../../types/gliderport'
import styles from './Details.module.css'

export default ({details, handleClick}: {details: GLIDER_OPERATION_POI; handleClick: () => void}) => {
  const {title, operationType} = details
  return (
    <div className={styles.container}>
      <button onClick={handleClick}>Back</button>
      <div className={styles.headerContainer}>
        <h1>{title}</h1>
        <img src="./images/gliderport.jpeg" alt="Gliderport" />
        <span>Front Royal, VA</span>
        <span>{operationType}</span>
      </div>
    </div>
  )
}
