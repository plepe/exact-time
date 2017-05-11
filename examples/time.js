'use strict'

const exactTime = require('../node')

const timeToString = time => {
  const t = Math.abs(time)
  const hours = Math.floor(t / 3600)
  const minutes = Math.floor(t % 3600 / 60)
  const seconds = Math.floor(t % 3600 % 60)

  let str = ''
  if (hours > 0) str += hours + ' hour' + (hours > 1 ? 's' : '')
  if (minutes > 0) str += (hours > 0 ? ', ' : '') + minutes + ' minute' + (minutes > 1 ? 's' : '')
  if (seconds > 0) str += (minutes > 0 ? ' and ' : '') + seconds + ' second' + (seconds > 1 ? 's' : '')

  return str
}

exactTime.getDate()
  .then(date => console.log('Exact time: ', date))
  .then(() => {
    exactTime.getOffset()
      .then(offset => {
        if (offset === 0) {
          console.log('Your time is exact!')
        } else {
          console.log('Your system clock is ' +
            timeToString(offset) +
            (offset > 0 ? ' ahead' : ' behind') + '.')
        }
      })
      .catch(err => console.error(err))
  })
  .catch(err => console.error(err))
