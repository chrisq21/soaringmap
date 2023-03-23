import styles from './List.module.css'

export default ({items, map, handleClick}) => {
  return (
    <div className={styles.container}>
      <span className={styles.category}>Glider Operation</span>
      {items.map((item, index) => (
        <button
          key={index}
          className={styles.itemTitle}
          onClick={() => {
            const currentZoom = map.current.getZoom()
            handleClick(item)
            map.current.easeTo({
              center: item.coordinates,
              zoom: currentZoom < 5.3 ? 5.3 : currentZoom,
            })
          }}
        >
          {item.title}
        </button>
      ))}
    </div>
  )
}
