export default url => new Promise((resolve, reject) => {
  if (process.env.BROWSER) {
    const xhr = new global.XMLHttpRequest()
    xhr.open('HEAD', url)
    xhr.send()
    xhr.onerror = () => reject(xhr.statusText)
    xhr.onreadystatechange = () => {
      if (xhr.readyState === xhr.HEADERS_RECEIVED) {
        resolve(xhr.getResponseHeader('Date'))
      }
    }
  } else {
    const http = require('http')
    const req = http.request({ host: url, method: 'HEAD' }, res => {
      resolve(res.headers.date)
    })

    req.on('error', err => {
      reject(err)
    })

    req.end()
  }
})
