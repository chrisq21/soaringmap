import {GLIDER_OPERATION_POI} from '../../types/POI'
import styles from './Details.module.css'

export default ({details, handleClick}: {details: GLIDER_OPERATION_POI; handleClick: () => void}) => {
  const {title, operationType} = details
  return (
    <div className={styles.container}>
      <button onClick={handleClick}>Back</button>
      <h1>{title}</h1>
      {/* TODO add location data */}
      <span>Front Royal, VA</span>
      <span>{operationType}</span>
    </div>
  )
}
