const space = process.env.CONTENTFUL_SPACE_ID
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

const client = require('contentful').createClient({
  space: 'g60vi85ul7q0', // fix
  accessToken: '1-u_ufbGtIp2NH_iVwXOze_hzOH4Qp3qeqWmv-Zm3Ro', // fix
})

export async function fetchGliderports() {
  const entries = await client.getEntries({
    content_type: 'gliderportCondensed',
  })

  if (entries.items) return entries.items
  console.log(`Error getting Entries for gliderport.`)
}
