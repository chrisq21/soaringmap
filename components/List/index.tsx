import styles from './List.module.css'

export default ({poiArray, map, handleClick}) => {
  return (
    <div className={styles.container}>
      <span className={styles.category}>Glider Operation</span>
      {poiArray.map((poi, index) => (
        <button
          key={index}
          className={styles.poiTitle}
          onClick={() => {
            const currentZoom = map.current.getZoom()
            handleClick(poi)
            map.current.easeTo({
              center: poi.coordinates,
              zoom: currentZoom < 5.3 ? 5.3 : currentZoom,
            })
          }}
        >
          {poi.title}
        </button>
      ))}
    </div>
  )
}
