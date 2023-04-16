import styles from './List.module.css'

export default ({items, map, handleClick}) => {
  function groupObjectsByState(objects) {
    const groups = {}
    for (const obj of objects) {
      const state = obj.state
      if (state in groups) {
        groups[state].push(obj)
      } else {
        groups[state] = [obj]
      }
    }
    const result = []
    for (const state in groups) {
      result.push({state, items: groups[state]})
    }
    result.sort((a, b) => a.state.localeCompare(b.state))
    return result
  }

  const itemsByState = groupObjectsByState(items)

  return (
    <div className={styles.container}>
      {itemsByState.map((group, index) => (
        <div key={index}>
          <span className={styles.category}>{group.state}</span>
          {group.items.map((item, index) => (
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
      ))}
    </div>
  )
}
