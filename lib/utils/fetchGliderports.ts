const space = process.env.CONTENTFUL_SPACE_ID
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

const client = require('contentful').createClient({
  space,
  accessToken,
})

export async function fetchGliderports() {
  const entries = await client.getEntries({
    content_type: 'gliderportCondensed',
  })

  if (entries.items) return entries.items
  console.log(`Error getting Entries for gliderport.`)
}
