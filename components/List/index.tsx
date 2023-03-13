import styles from './List.module.css'

export default ({poiArray, map, handleClick}) => {
  return (
    <div>
      <span className={styles.category}>Glider Operation</span>
      {poiArray.map((poi, index) => (
        <button
          key={index}
          className={styles.poiTitle}
          onClick={() => {
            handleClick(poi)
            map.current.easeTo({
              center: poi.coordinates,
            })
          }}
        >
          {poi.title}
        </button>
      ))}
    </div>
  )
}
