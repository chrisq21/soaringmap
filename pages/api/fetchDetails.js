const googleAPIToken = process.env.NEXT_PUBLIC_GOOGLE_PLACES_TOKEN
const placesSearchBaseUrl = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json'
const placesDetailsBaseUrl = 'https://maps.googleapis.com/maps/api/place/details/json'

export default async (req, res) => {
  const fetchBaseInfo = async () => {
    const {title, coordinates} = req.body
    const placesSearchParams = new URLSearchParams()
    placesSearchParams.append('input', title)
    placesSearchParams.append('inputtype', 'textquery')
    placesSearchParams.append('fields', 'name,place_id,photos')
    placesSearchParams.append('locationbias', `circle:10@${coordinates[1]},${coordinates[0]}`)
    placesSearchParams.append('key', googleAPIToken)
    const detailsRequestUrl = `${placesSearchBaseUrl}?${placesSearchParams.toString()}`

    try {
      const res = await fetch(detailsRequestUrl)
      const json = await res.json()
      const {candidates} = json
      const info = candidates[0]
      return info
    } catch (error) {
      console.error(error)
    }
  }

  const fetchDetails = async (place_id) => {
    const placesDetailsParams = new URLSearchParams()
    placesDetailsParams.append('place_id', place_id)
    placesDetailsParams.append('fields', 'formatted_phone_number,website,photos')
    placesDetailsParams.append('key', googleAPIToken)
    const detailsRequestUrl = `${placesDetailsBaseUrl}?${placesDetailsParams.toString()}`

    try {
      const res = await fetch(detailsRequestUrl)
      const json = await res.json()
      return json.result
    } catch (error) {
      console.error(error)
    }
  }

  const baseInfo = await fetchBaseInfo()
  const {place_id} = baseInfo
  const details = await fetchDetails(place_id)

  const result = {...baseInfo, ...details}

  res.status(200).json(result)
}
