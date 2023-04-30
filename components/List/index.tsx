import {useState} from 'react'
import styles from './List.module.css'
import Accordion from 'react-bootstrap/Accordion'
import {Form, InputGroup} from 'react-bootstrap'
import {BsSearch} from 'react-icons/bs'

export default ({items, map, handleClick}) => {
  const [searchQuery, setSearchQuery] = useState('')

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

  const searchResults = items.filter((item) => {
    const title = item.title.toLowerCase()
    const query = searchQuery.toLowerCase()
    return title.includes(query)
  })

  return (
    <div className={styles.container}>
      <InputGroup>
        <InputGroup.Text id="searchIcon">
          <BsSearch />
        </InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Search by title"
          aria-label="search by title"
          aria-describedby="searchIcon"
          onChange={(e) => {
            setSearchQuery(e.target.value)
          }}
        />
      </InputGroup>
      {searchQuery && (
        <div className={styles.searchContainer}>
          <div className={styles.searchResults}>
            {searchResults.map((item, index) => {
              return (
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
              )
            })}
          </div>
        </div>
      )}
      {!searchQuery && (
        <Accordion>
          {itemsByState.map((group, index) => (
            <Accordion.Item eventKey={String(index)} key={index}>
              <Accordion.Header className={styles.category}>{group.state}</Accordion.Header>
              {group.items.map((item, index) => (
                <Accordion.Body key={index}>
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
                </Accordion.Body>
              ))}
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </div>
  )
}
