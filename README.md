# exact-time
> Promise based lib to get the exact date and time with ease.

## Installation
```bash
$ npm install --save exact-time
```

## Usage
```javascript
const exactTime = require('exact-time')

exactTime.getDate()
  .then(date => console.log(date.toString()))

// Thu May 11 2017 12:20:40 GMT+0200 (CEST)
```

## Example
```bash
$ node examples/time.js

Exact time:  Thu May 11 2017 12:20:40 GMT+0200 (CEST)
Your system clock is 1 minute and 7 seconds behind.
```

## API
### getDate([forceNetSync])
Type: `Date` <br>
Returns a [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) object with the exact time.

### getOffset([forceNetSync])
Type: `Number` <br>
Returns the difference between system time and exact time in seconds.

##### forceNetSync
Type: `Boolean` <br>
Forces a new time sync with the server. <br>

## License
MIT © Vincenzo Greco
