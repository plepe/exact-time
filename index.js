import fetchHeadDate from './fetch-head-date'

// Use google server to retrieve the exact date and time
const SERVER_URL = 'https://www.googleapis.com/discovery/v1/apis?fields='
// Resync if more than an hour has passed
const TIME_BETWEEN_REQ = 36 * 1e5

let lastRequestTime = 0
let lastOffset = 0
let lastExactTime

const getDateTime = forceNetSync => {
  const timeSinceLastRequest = Date.now() - lastRequestTime

  if (!forceNetSync && lastExactTime && timeSinceLastRequest < TIME_BETWEEN_REQ) {
    return Promise.resolve({
      utc: lastExactTime + timeSinceLastRequest,
      offset: lastOffset
    })
  } else {
    lastRequestTime = Date.now()
    return fetchHeadDate(SERVER_URL)
      // take net delay into account
      .then(date => Date.parse(date) + (Date.now() - lastRequestTime))
      .then(utc => {
        // cache values
        lastExactTime = utc
        lastRequestTime = Date.now()
        lastOffset = Math.floor((lastRequestTime - utc) / 1e3)

        return {
          utc,
          offset: lastOffset
        }
      })
  }
}

export const getDate = forceNetSync => getDateTime(forceNetSync)
  .then(date => new Date(date.utc))

export const getOffset = forceNetSync => getDateTime(forceNetSync)
  .then(date => date.offset)
