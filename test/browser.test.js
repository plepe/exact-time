global.XMLHttpRequest = function () {
  return { open () {}, send () {} }
}

const tap = require('tap')
const test = tap.test
const threw = tap.threw
const sinon = require('sinon')
const lib = require('../browser')

const ignoreMs = time => Math.floor(time / 1e3)

const serverDate = 'Wed, 22 Feb 2022 22:22:22 GMT'
const serverHeaders = { Date: serverDate }

test('getDate - without errors', t => {
  const server = sinon.fakeServer.create()
  server.respondWith([200, serverHeaders, ''])

  lib.getDate(true).then(date => {
    t.equal(
      ignoreMs(date.getTime()),
      ignoreMs(new Date(serverDate).getTime()),
      'Should return the correct time')

    server.restore()
    t.end()
  }).catch(threw)

  server.respond()
})

test('getDate - cached', t => {
  t.plan(3)

  const elapsedTime = 5000
  const clock = sinon.useFakeTimers(Date.now())
  const server = sinon.fakeServer.create()
  server.respondWith([200, serverHeaders, ''])

  lib.getDate(true).then(netDate => {
    lib.getDate().then(cachedDate => {
      t.equal(
        ignoreMs(cachedDate.getTime()),
        ignoreMs(netDate.getTime()),
        'Should return the same date')
    }).catch(threw)

    clock.tick(elapsedTime)

    lib.getDate().then(cachedDate => {
      t.equal(
        ignoreMs(cachedDate.getTime()),
        ignoreMs(netDate.getTime() + elapsedTime),
        'Should take into account elapsed time')
    }).catch(threw)

    server.respond()

    clock.restore()
    server.restore()
  }).catch(threw)

  t.equal(server.requests.length, 1,
    'Should make only one net request')

  server.respond()
})

test('getDate - net delay', t => {
  const netDelay = 2000
  const clock = sinon.useFakeTimers(Date.now())
  const server = sinon.fakeServer.create()
  server.respondWith([200, serverHeaders, ''])

  lib.getDate(true).then(date => {
    t.equal(
      ignoreMs(date.getTime()),
      ignoreMs(new Date(serverDate).getTime() + netDelay),
      'Should take into accout net delay')

    server.restore()
    clock.restore()
    t.end()
  }).catch(threw)

  clock.tick(netDelay)
  server.respond()
})

test('getDate - net error', t => {
  const server = sinon.fakeServer.create()
  server.respondWith(xhr => xhr.error())

  lib.getDate(true).catch(() => {
    t.pass()

    server.restore()
    t.end()
  })

  server.respond()
})

test('getOffset - without errors', t => {
  const clock = sinon.useFakeTimers(Date.now())
  const server = sinon.fakeServer.create()
  server.respondWith([200, serverHeaders, ''])

  lib.getOffset(true).then(offset => {
    t.equal(
      offset,
      ignoreMs(Date.now() - new Date(serverDate)),
      'Should return the correct offset')

    server.restore()
    clock.restore()
    t.end()
  }).catch(threw)

  server.respond()
})
