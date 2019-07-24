const fs = require('fs')

outputCSV('output.csv', buildCSV(mapRows(fetchEntries('short.csv'))))

function fetchEntries(filename) {
  return fs
    .readFileSync(filename, {
      encoding: 'utf-8'
    })
    .split('\r\n') // split on new line for microsoft (switch for MacOS/Linux)
    .slice(1) // cut out top line with schema definition
    .filter(val => !!val) // filter out blanks
}

function mapRows(entries) {
  return entries.map(value => createNameWeightPairsFromRow(parseRow(value)))
}

function parseRow(rowString) {
  // splits string into name/weight pairs (tuple)
  return rowString.substr(rowString.indexOf(',') + 1).split('; ')
}

function createNameWeightPairsFromRow(row) {
  return row.reduce((acc, pair) => {
    const [name, weight] = pair.split(' :: ')

    if (!acc.hasOwnProperty(name)) {
      acc[name] = weight
    }

    return acc
  }, {})
}

function buildCSV(rows) {
  const csvArray = []

  keys = getAllKeys(rows)

  csvArray.push(keys.join(','))

  rows.forEach(row => {
    const rowValues = Array(keys.length)

    Object.keys(row).forEach(key => {
      const position = keys.indexOf(key)
      rowValues[position] = row[key]
    })
    
    csvArray.push(rowValues.join(','))
  })

  return csvArray
}

function getAllKeys(rows) {
  let keys = []
  const rowKeys = rows.map(row => Object.keys(row))

  for (rowKey of rowKeys) {
    for (let i = 0; i < rowKey.length; i++) {
      keys.push(rowKey.pop())
    }
  }

  return Array.from(new Set(keys))
}

function outputCSV(outputFilename, csvArray) {
  const writeStream = fs.createWriteStream(outputFilename)

  csvArray.forEach(row => {
    row = row + '\r\n'
    writeStream.write(row, 'utf-8')
  })

  writeStream.end()
}
