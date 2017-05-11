const tap = require('tap')
const test = tap.test
const threw = tap.threw
const sinon = require('sinon')
const http = require('http')
const PassThrough = require('stream').PassThrough
const lib = require('../node')

const ignoreMs = time => Math.floor(time / 1e3)

const serverDate = 'Wed, 22 Feb 2022 22:22:22 GMT'
const serverHeaders = { headers: { date: serverDate } }

test('getDate - without errors', t => {
  const requestStub = sinon.stub(http, 'request')
  requestStub.callsArgWith(1, serverHeaders)

  lib.getDate(true).then(date => {
    t.equal(
      ignoreMs(date.getTime()),
      ignoreMs(new Date(serverDate).getTime()),
      'Should return the correct time')

    requestStub.restore()
    t.end()
  }).catch(threw)
})

test('getDate - cached', t => {
  t.plan(3)

  const elapsedTime = 5000
  const clock = sinon.useFakeTimers(Date.now())
  const requestStub = sinon.stub(http, 'request')
  requestStub.callsArgWith(1, serverHeaders)

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

    clock.restore()
    requestStub.restore()
  }).catch(threw)

  t.ok(requestStub.calledOnce,
    'Should make only one net request')
})

test('getDate - net delay', t => {
  const netDelay = 2000
  const clock = sinon.useFakeTimers(Date.now())
  const requestStub = sinon.stub(http, 'request')

  requestStub.callsArgWith(1, serverHeaders)

  lib.getDate(true).then(date => {
    t.equal(
      ignoreMs(date.getTime()),
      ignoreMs(new Date(serverDate).getTime() + netDelay),
      'Should take into accout net delay')

    requestStub.restore()
    clock.restore()
    t.end()
  }).catch(threw)

  clock.tick(netDelay)
})

test('getDate - net error', t => {
  const request = new PassThrough()
  const requestStub = sinon.stub(http, 'request')
  const requestError = new Error('Error')

  requestStub.returns(request)

  lib.getDate(true).catch(err => {
    t.deepEqual(err, requestError,
      'Should return an error')

    requestStub.restore()
    t.end()
  })

  request.emit('error', requestError)
})

test('getOffset - without errors', t => {
  const clock = sinon.useFakeTimers(Date.now())
  const requestStub = sinon.stub(http, 'request')

  requestStub.callsArgWith(1, serverHeaders)

  lib.getOffset(true).then(offset => {
    t.equal(
      offset,
      ignoreMs(Date.now() - new Date(serverDate)),
      'Should return the correct offset')

    requestStub.restore()
    clock.restore()
    t.end()
  }).catch(threw)
})
