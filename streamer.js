const fs = require('fs')

const rs = fs.createReadStream('short.csv')

const records = []
let lastChar = ''
const recordsToRead = 3
let recordsRead = 0

rs.on('readable', () => {
  let record = ''

  while (rs.readable) {
    // if we've reached a newline, we have a complete record
    if (lastChar.codePointAt(0) === 10) {


      if (recordsRead !== 0) {
        records.push(parseRecord(record)) 
      }

      record = ''
      recordsRead++
    }

    if (recordsRead === recordsToRead) {
      rs.close()

      // all records are ready, put analytic logic here

      break
    }

    chunk = rs.read(1)
    lastChar = chunk.toString()

    if (lastChar.codePointAt(0) !== 10) {
      record = record + lastChar
    }
  }
})

function parseRecord(record) {
  const parsedRecord = Object.create({
    values: []
  })

  record
    .substr(record.indexOf(',') + 1)
    .split('; ')
    .forEach(pair => {
      parsedRecord.values.push(pair.split(' :: '))
    })

  return parsedRecord
}

// chunk = rs.read(1)
// console.log(chunk.toString())
// chunk = rs.read(1)
// console.log(chunk.toString())
// chunk = rs.read(1)
// console.log(chunk.toString())
// chunk = rs.read(1)
// console.log(chunk.toString())
// chunk = rs.read(1)
// console.log(chunk.toString())
// chunk = rs.read(1)
// console.log(chunk.toString())
// chunk = rs.read(1)
// console.log(chunk.toString())
// chunk = rs.read(1)
// console.log(chunk.toString())
